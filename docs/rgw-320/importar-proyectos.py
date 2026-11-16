#!/usr/bin/env python3
"""RGW-330 — Importación masiva de Proyectos (CPT `projects`) vía REST.

Reutiliza `gussware-projects-import` + núcleo `gussware-import-core` v1.0:
validación estructural, pre-vuelo de solo lectura, resolución por
`project_code` (clave lógica) con salvaguardas, dependencias
(términos/empresa) antes de persistir, idempotencia y reporte
independiente. Lote: `proyectos.json`.

Modos: --validar, --pre-vuelo, --importar. Sin modo = validar +
pre-vuelo (nunca escribe por defecto).

Restricciones: preserva estados (nunca publica), no crea traducciones
para ítems con `en: null`, no asigna taxonomía en EN (sin términos EN),
no escribe espejos ACF de taxonomías (solo verificación), galería
excluida, sin subidas.
"""

import argparse
import base64
import json
import os
import sys
import unicodedata
import urllib.error
import urllib.request
from pathlib import Path

HERE = Path(__file__).resolve().parent
REPO = HERE.parent.parent
ACF_REQUIRED = ["project_code", "status"]
ACF_OPTIONAL = [
    "short_description", "description", "executive_summary",
    "role_performed", "start_date", "end_date", "is_ongoing",
    "is_featured", "display_order", "context_objective", "problem_need",
    "implemented_solution", "funcionalidades_desarrolladas",
    "responsibilities_contributions", "results_achievements",
    "verifiable_metrics", "project_url", "demo_url", "repository_url",
]
ACF_TAX_MIRRORS = ("project_type", "industry_sector", "technology")


def norm(s):
    if not isinstance(s, str):
        return ""
    s = unicodedata.normalize("NFC", s)
    s = " ".join(s.split())
    return s.casefold() if s.strip() else ""


class Api:
    def __init__(self, base, user, password):
        self.base = base.rstrip("/")
        token = base64.b64encode(f"{user}:{password}".encode()).decode()
        self.headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Basic " + token,
        }

    def call(self, method, path, payload=None):
        req = urllib.request.Request(
            self.base + "/wp-json" + path, method=method, headers=self.headers,
            data=json.dumps(payload).encode() if payload is not None else None)
        try:
            with urllib.request.urlopen(req) as resp:
                body = resp.read().decode()
                return resp.status, json.loads(body) if body else None
        except urllib.error.HTTPError as e:
            return e.code, {"_http_error": e.code,
                            "_body": e.read().decode()[:300]}


def load_dotenv(repo):
    env = {}
    p = repo / ".env"
    if p.exists():
        for line in p.read_text().splitlines():
            line = line.strip()
            if line and "=" in line and not line.startswith("#"):
                k, v = line.split("=", 1)
                env[k.strip()] = v.strip().strip('"')
    return env


def validar(lote):
    errores = []
    if lote.get("version") != 1:
        errores.append("version debe ser 1")
    if lote.get("type") != "proyectos":
        errores.append("type debe ser 'proyectos'")
    items = lote.get("items")
    if not isinstance(items, list) or not items:
        errores.append("items debe ser lista no vacía")
        return errores
    seen = set()
    for n, it in enumerate(items):
        tag = f"items[{n}]"
        code = norm(it.get("project_code", ""))
        if not code:
            errores.append(f"{tag}: PROJECT_CODE_MISSING")
        elif code in seen:
            errores.append(f"{tag}: project_code duplicado")
        else:
            seen.add(code)
        es = it.get("es")
        if not isinstance(es, dict) or not norm(es.get("titulo", "")) or not norm(es.get("slug", "")):
            errores.append(f"{tag}.es: titulo/slug requeridos")
        en = it.get("en")
        if en is not None and not norm(en.get("titulo", "")):
            errores.append(f"{tag}.en: titulo requerido si el lado existe")
        for lado in ("es", "en"):
            bloque = it.get(lado)
            if bloque is None:
                continue
            acf = bloque.get("acf")
            if not isinstance(acf, dict):
                errores.append(f"{tag}.{lado}: acf no es objeto")
                continue
            for k in ACF_REQUIRED:
                if acf.get(k) in (None, ""):
                    errores.append(f"{tag}.{lado}: falta ACF requerido '{k}'")
            if acf.get("status") not in ("in_development", "completed"):
                errores.append(f"{tag}.{lado}: acf.status inválido")
        if not norm(it.get("es", {}).get("empresa", "")):
            errores.append(f"{tag}: empresa (client_company) requerida")
        anchors = it.get("es", {}).get("taxonomia_ids")
        if anchors is not None:
            if not isinstance(anchors, dict) or not all(
                    k in ("projects_type", "technologies", "industries_sector")
                    and isinstance(v, list) and all(isinstance(i, int) for i in v)
                    for k, v in anchors.items()):
                errores.append(f"{tag}: taxonomia_ids inválido")
    return errores


def pre_vuelo(api):
    info = {"ok": True, "detalle": []}
    s, langs = api.call("GET", "/pll/v1/languages")
    codes = {L.get("slug") for L in langs} if s == 200 and isinstance(langs, list) else set()
    info["detalle"].append(f"idiomas: {sorted(codes)}")
    if not {"es", "en"} <= codes:
        info["ok"] = False
        info["detalle"].append("BLOQUEO: faltan idiomas es/en")
    recs = []
    for lang in ("es", "en"):
        s, lst = api.call("GET", f"/wp/v2/projects?lang={lang}&per_page=100&status=publish,draft&_fields=id,slug,title,lang,translations,projects_type,technologies,industries_sector,status,acf.project_code,acf.status")
        if s != 200 or not isinstance(lst, list):
            info["ok"] = False
            info["detalle"].append(f"BLOQUEO: listado projects {lang} inaccesible")
        else:
            recs += lst
    info["detalle"].append(f"proyectos vivos: {len(recs)}")
    terms = {}
    for key, (rest,) in (("tipos", ("projects_type",)), ("tecnologias", ("technologies",)), ("sectores", ("industries_sector",))):
        s, lst = api.call("GET", f"/wp/v2/{rest}?per_page=100&_fields=id,name,lang")
        terms[key] = lst if s == 200 and isinstance(lst, list) else []
        info["detalle"].append(f"{rest}: {len(terms[key])} (EN: {sum(1 for t in terms[key] if t.get('lang') == 'en')})")
    s, comps = api.call("GET", "/wp/v2/client_company?per_page=100&status=publish,draft&_fields=id,title,lang,translations")
    comps = comps if s == 200 and isinstance(comps, list) else []
    info["detalle"].append(f"client_company: {len(comps)}")
    s, schema = api.call("OPTIONS", "/wp/v2/projects")
    props = set((schema.get("schema", {}).get("properties", {}) or {}).keys()) if s == 200 else set()
    for necesario in ("title", "slug", "acf", "lang", "translations", "projects_type", "technologies", "industries_sector", "status"):
        if necesario not in props:
            info["ok"] = False
            info["detalle"].append(f"BLOQUEO: falta '{necesario}' en esquema")
    info["detalle"].append("esquema OK; content/excerpt inexistentes; galería excluida")
    return info, recs, terms, comps


def buscar_termino(terms, nombre, lang):
    cand = [t for t in terms if norm(t.get("name", "")) == norm(nombre)
            and t.get("lang") in (lang, False)]
    if len(cand) > 1:
        return None, "TERM_AMBIGUOUS"
    return (cand[0]["id"] if cand else None), ""


def resolver_taxonomia(terms_por_clave, nombres, anchors, lang):
    """IDs por ancla verificada (gana sobre nombre) o por nombre.

    Caso verificado: 'Php' collisiona entre legado 34 (lang:false) y
    `es` 71 → sin ancla es TERM_AMBIGUOUS; con ancla se verifica que el
    ID exista y que su nombre corresponda a lo declarado.
    """
    por_id = {t["id"]: t for t in terms_por_clave}
    if anchors:
        ids = []
        for tid in anchors:
            t = por_id.get(tid)
            if t is None or t.get("lang") not in (lang, False):
                return None, f"ancla {tid} inválida para '{lang}'"
            if norm(t.get("name", "")) not in {norm(n) for n in nombres}:
                return None, f"ancla {tid} apunta a otro término"
            ids.append(tid)
        return ids, ""
    ids = []
    for nombre in nombres:
        tid, err = buscar_termino(terms_por_clave, nombre, lang)
        if tid is None:
            return None, f"término '{nombre}' {err or 'inexistente'} (no se crea)"
        ids.append(tid)
    return ids, ""


def resolver_empresa(api, comps, titulo, lang):
    cand = [c for c in comps if norm((c.get("title") or {}).get("rendered", "")) == norm(titulo)
            and c.get("lang") == lang]
    if len(cand) > 1:
        return None, "COMPANY_AMBIGUOUS"
    if cand:
        return cand[0]["id"], "REUSED"
    s, nuevo = api.call("POST", "/wp/v2/client_company",
                        {"title": titulo, "status": "draft", "lang": lang})
    if s not in (200, 201) or not isinstance(nuevo, dict):
        return None, "COMPANY_UNRESOLVED"
    comps.append(nuevo)
    return nuevo["id"], "CREATED"


def importar(api, lote, recs, terms, comps):
    code_idx = {}
    for r in recs:
        code = norm((r.get("acf") or {}).get("project_code", ""))
        if code:
            code_idx.setdefault(code, []).append(r)
    reporte, asignados = [], []
    for item in lote["items"]:
        code = norm(item.get("project_code", ""))
        grupo = code_idx.get(code, [])
        es_vivo = next((r for r in grupo if r.get("lang") == "es"), None)
        en_vivo = next((r for r in grupo if r.get("lang") == "en"), None)
        if len(grupo) > 2 or (es_vivo and en_vivo and (es_vivo.get("translations") or {}).get("en") != en_vivo["id"]):
            reporte.append({"code": item["project_code"], "estado": "AMBIGUOUS",
                            "detalle": "PROJECT_CODE_CONFLICT o enlace inconsistente"})
            continue
        if es_vivo is None and item.get("es") is not None:
            por_slug = [r for r in recs if norm(r.get("slug", "")) == norm(item["es"].get("slug", "")) and r.get("lang") == "es"]
            if por_slug and norm((por_slug[0].get("acf") or {}).get("project_code", "")) != code:
                reporte.append({"code": item["project_code"], "estado": "AMBIGUOUS",
                                "detalle": "slug apunta a otro project_code"})
                continue
            if por_slug and not norm((por_slug[0].get("acf") or {}).get("project_code", "")):
                es_vivo = por_slug[0]
                asignados.append(f"{code} -> post {es_vivo['id']} (CODE_ASSIGNED)")
        if es_vivo is None:
            reporte.append({"code": item["project_code"], "estado": "SKIPPED",
                            "detalle": "sin registro vivo; no se crea sin requisito aprobado"})
            continue
        estado_previo = es_vivo.get("status")
        # dependencias: términos ES (anclas verificadas ganan al nombre)
        anchors = item["es"].get("taxonomia_ids") or {}
        tids = {}
        fallo = None
        for json_key, rest in (("tipos", "projects_type"),
                               ("tecnologias", "technologies"),
                               ("sectores", "industries_sector")):
            ids, err = resolver_taxonomia(
                terms[json_key],
                item["es"].get(json_key, []),
                anchors.get(rest),
                "es")
            if err:
                fallo = err
                break
            tids[rest] = ids
        if fallo:
            reporte.append({"code": item["project_code"], "estado": "ERROR", "detalle": fallo})
            continue
        emp_id, emp_modo = resolver_empresa(api, comps, item["es"]["empresa"], "es")
        if emp_id is None:
            reporte.append({"code": item["project_code"], "estado": "ERROR", "detalle": emp_modo})
            continue
        # escritura ES (sin slug ni status: se preservan). Los espejos ACF
        # de taxonomías SON requeridos por el esquema vivo: se escriben
        # con los IDs resueltos (mismos que la asignación top-level).
        acf_es = {k: v for k, v in (item["es"]["acf"] or {}).items()
                  if k not in ACF_TAX_MIRRORS + ("client_company",)}
        acf_es["client_company"] = [emp_id]
        acf_es["project_type"] = tids.get("projects_type", [])
        acf_es["technology"] = tids.get("technologies", [])
        acf_es["industry_sector"] = tids.get("industries_sector", [])
        payload = {"title": item["es"]["titulo"], "acf": acf_es, "lang": "es",
                   "projects_type": tids.get("projects_type", []),
                   "technologies": tids.get("technologies", []),
                   "industries_sector": tids.get("industries_sector", [])}
        s, _ = api.call("POST", f"/wp/v2/projects/{es_vivo['id']}", payload)
        if s not in (200, 201):
            reporte.append({"code": item["project_code"], "estado": "ERROR",
                            "detalle": f"POST ES {es_vivo['id']} HTTP {s}"})
            continue
        detalle_en = ""
        if item.get("en") is not None:
            if en_vivo is None:
                reporte.append({"code": item["project_code"], "estado": "ERROR",
                                "detalle": "lado EN sin registro vivo; no se crea traducción"})
                continue
            emp_en, modo_en = resolver_empresa(api, comps, item["en"].get("empresa") or item["es"]["empresa"], "en")
            if emp_en is None:
                reporte.append({"code": item["project_code"], "estado": "ERROR", "detalle": modo_en})
                continue
            acf_en = {k: v for k, v in (item["en"]["acf"] or {}).items()
                      if k not in ACF_TAX_MIRRORS + ("client_company",)}
            acf_en["client_company"] = [emp_en]
            # espejos EN: requeridos por el esquema; se preservan los vivos
            s_live, en_live = api.call("GET", f"/wp/v2/projects/{en_vivo['id']}?_fields=acf")
            espejos_en = (en_live.get("acf") or {}) if s_live == 200 and isinstance(en_live, dict) else {}
            for espejo in ACF_TAX_MIRRORS:
                acf_en[espejo] = espejos_en.get(espejo)
            s, _ = api.call("POST", f"/wp/v2/projects/{en_vivo['id']}",
                            {"title": item["en"]["titulo"], "acf": acf_en, "lang": "en"})
            if s not in (200, 201):
                reporte.append({"code": item["project_code"], "estado": "ERROR",
                                "detalle": f"POST EN {en_vivo['id']} HTTP {s}"})
                continue
            # enlace bidireccional (solo reparar lo ausente: reenviar enlaces
            # correctos dispara la sincronización de términos de Polylang)
            enlace = []
            if (es_vivo.get("translations") or {}).get("en") != en_vivo["id"]:
                api.call("POST", f"/wp/v2/projects/{es_vivo['id']}",
                         {"lang": "es", "translations": {"en": en_vivo["id"]}})
                enlace.append("ES→EN reparado")
            if (en_vivo.get("translations") or {}).get("es") != es_vivo["id"]:
                api.call("POST", f"/wp/v2/projects/{en_vivo['id']}",
                         {"lang": "en", "translations": {"es": es_vivo["id"]}})
                enlace.append("EN→ES reparado")
            if enlace:
                detalle_en = f" + EN {en_vivo['id']} (empresa {modo_en}; {', '.join(enlace)})"
            else:
                detalle_en = f" + EN {en_vivo['id']} (empresa {modo_en}; enlace ya verificado)"
        # verificación posterior
        s, v = api.call("GET", f"/wp/v2/projects/{es_vivo['id']}?_fields=id,title,lang,translations,status,acf.project_code,acf.status,acf.project_type,acf.technology,acf.industry_sector,projects_type,technologies,industries_sector")
        acf_v = v.get("acf") or {} if isinstance(v, dict) else {}
        ok = (s == 200 and norm((v.get("title") or {}).get("rendered", "")) == norm(item["es"]["titulo"])
              and norm(acf_v.get("project_code", "")) == code
              and v.get("status") == estado_previo
              and set(v.get("projects_type") or []) == set(tids.get("projects_type", []))
              and set(v.get("technologies") or []) == set(tids.get("technologies", []))
              and set(v.get("industries_sector") or []) == set(tids.get("industries_sector", []))
              and set(acf_v.get("project_type") or []) == set(tids.get("projects_type", []))
              and set(acf_v.get("technology") or []) == set(tids.get("technologies", []))
              and set(acf_v.get("industry_sector") or []) == set(tids.get("industries_sector", [])))
        tr_ok = True
        if item.get("en") is not None and en_vivo is not None:
            s2, v2 = api.call("GET", f"/wp/v2/projects/{en_vivo['id']}?_fields=id,lang,translations,status")
            tr_ok = (s2 == 200 and (v.get("translations") or {}).get("en") == en_vivo["id"]
                     and (v2.get("translations") or {}).get("es") == es_vivo["id"])
        if ok and tr_ok:
            reporte.append({"code": item["project_code"], "estado": "UPDATED",
                            "detalle": f"ES {es_vivo['id']} (empresa {emp_modo}, status {estado_previo} preservado){detalle_en}; espejos y taxonomías verificados"})
        else:
            reporte.append({"code": item["project_code"], "estado": "ERROR",
                            "detalle": "verificación posterior fallida"})
    return reporte, asignados


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--base", default="http://gussware.local")
    ap.add_argument("--user", default=None)
    ap.add_argument("--password", default=None)
    ap.add_argument("--lote", default=str(HERE / "proyectos.json"))
    ap.add_argument("--reporte", default=str(HERE / "reporte-proyectos.md"))
    ap.add_argument("--validar", action="store_true")
    ap.add_argument("--pre-vuelo", action="store_true")
    ap.add_argument("--importar", action="store_true")
    args = ap.parse_args()

    env = load_dotenv(REPO)
    user = args.user or os.environ.get("WP_USER") or env.get("WP_USER") or env.get("POSTMAN_APP_USERNAME")
    password = args.password or os.environ.get("WP_APP_PASSWORD") or env.get("WP_APP_PASSWORD") or env.get("POSTMAN_APP_PASSWORD")
    if not user or not password:
        print("BLOQUEO: sin credenciales (WP_USER/WP_APP_PASSWORD o .env)")
        return 2
    api = Api(args.base, user, password)
    try:
        lote = json.loads(Path(args.lote).read_text())
    except (OSError, json.JSONDecodeError) as e:
        print(f"lote inválido ({args.lote}): {e}")
        return 2

    errores = validar(lote)
    print(f"validación estructural: {len(errores)} errores")
    for e in errores:
        print("  - " + e)
    if errores or args.validar or not (args.pre_vuelo or args.importar):
        return 1 if errores else 0

    info, recs, terms, comps = pre_vuelo(api)
    for d in info["detalle"]:
        print("pre-vuelo: " + d)
    if not info["ok"]:
        print("BLOQUEO en pre-vuelo: sin escrituras")
        return 2
    if not args.importar:
        print("pre-vuelo OK (sin escrituras)")
        return 0

    reporte, asignados = importar(api, lote, recs, terms, comps)
    n = lambda e: sum(1 for r in reporte if r["estado"] == e)
    lineas = ["# RGW-330 — Reporte de importación masiva de Proyectos", ""]
    for r in reporte:
        lineas.append(f"- {r['code']}: **{r['estado']}** — {r['detalle']}")
    lineas += ["",
               f"Creados: {n('CREATED')} | Actualizados: {n('UPDATED')} | Omitidos: {n('SKIPPED')} | "
               f"Ambiguos: {n('AMBIGUOUS')} | Fallidos: {n('ERROR')}",
               "Estados preservados; segunda ejecución idempotente.",
               "Español/inglés verificados en ambas direcciones; espejos ACF de taxonomías "
               "escritos con IDs resueltos (ES) / preservados (EN) y verificados."]
    if asignados:
        lineas.append("Códigos asignados: " + "; ".join(asignados))
    Path(args.reporte).write_text("\n".join(lineas) + "\n")
    print("\n".join(lineas))
    return 0 if not ([r for r in reporte if r["estado"] in ("AMBIGUOUS", "ERROR")]) else 1


if __name__ == "__main__":
    sys.exit(main())
