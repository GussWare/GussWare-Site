#!/usr/bin/env python3
"""RGW-329 — Importación masiva de Servicios (CPT `service`) vía REST.

Reutiliza `gussware-services-import` + núcleo `gussware-import-core` v1.0:
validación estructural, pre-vuelo de solo lectura, resolución por
identificadores estables (translations → slug → título normalizado),
idempotencia y reporte independiente. Lote: `servicios.json`.

Modos: --validar (solo estructura), --pre-vuelo (solo lectura),
--importar (validar + pre-vuelo + escrituras + verificación).
Sin modo = validar + pre-vuelo (nunca escribe por defecto).

Restricciones aplicadas: preserva estados (nunca publica), no toca
slugs EN vacíos, no asigna taxonomía en EN (sin términos EN vivos),
no sube archivos, no toca excerpt/content (fuera del esquema vivo).
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
ACF_KEYS = [
    "intro_eyebrow", "intro_title", "intro_description",
    "intro_eyebrow_suffix", "hero_stats", "development_title",
    "development_content", "development_tags", "solutions_eyebrow",
    "solutions_title", "solutions_description", "solutions",
    "approach_title", "approach_description", "approach", "tech_title",
    "tech_description", "tech_groups", "faq_items", "cta",
]


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
    if lote.get("type") != "servicios":
        errores.append("type debe ser 'servicios'")
    items = lote.get("items")
    if not isinstance(items, list) or not items:
        errores.append("items debe ser lista no vacía")
        return errores
    seen = set()
    for n, it in enumerate(items):
        tag = f"items[{n}]"
        clave = it.get("clave", "")
        if not norm(clave):
            errores.append(f"{tag}: clave vacía")
        elif norm(clave) in seen:
            errores.append(f"{tag}: clave duplicada '{clave}'")
        else:
            seen.add(norm(clave))
        for lado in ("es", "en"):
            bloque = it.get(lado)
            if bloque is None:
                errores.append(f"{tag}: falta bloque '{lado}'")
                continue
            if not norm(bloque.get("titulo", "")):
                errores.append(f"{tag}.{lado}: titulo vacío")
            acf = bloque.get("acf")
            if not isinstance(acf, dict):
                errores.append(f"{tag}.{lado}: acf no es objeto")
            else:
                for k in ACF_KEYS:
                    if k not in acf:
                        errores.append(f"{tag}.{lado}: falta clave ACF '{k}'")
        if n == 0 and not norm(it.get("es", {}).get("slug", "")):
            errores.append(f"{tag}.es: slug vacío")
    return errores


def pre_vuelo(api):
    info = {"ok": True, "detalle": []}
    s, langs = api.call("GET", "/pll/v1/languages")
    codes = {L.get("slug") for L in langs} if s == 200 and isinstance(langs, list) else set()
    info["detalle"].append(f"idiomas: {sorted(codes)}")
    if not {"es", "en"} <= codes:
        info["ok"] = False
        info["detalle"].append("BLOQUEO: faltan idiomas es/en")
    s, es = api.call("GET", "/wp/v2/services?lang=es&per_page=100&status=publish,draft&_fields=id,slug,title,lang,translations,service-categories,status")
    s2, en = api.call("GET", "/wp/v2/services?lang=en&per_page=100&status=publish,draft&_fields=id,slug,title,lang,translations,status")
    if s != 200 or s2 != 200:
        info["ok"] = False
        info["detalle"].append("BLOQUEO: listados ES/EN inaccesibles")
        return info, {}, {}, []
    info["detalle"].append(f"servicios ES: {len(es)}, EN: {len(en)}")
    s, terms = api.call("GET", "/wp/v2/service-categories?per_page=100&_fields=id,name,lang")
    terms = terms if s == 200 and isinstance(terms, list) else []
    info["detalle"].append(f"categorías: {len(terms)} (EN: {sum(1 for t in terms if t.get('lang') == 'en')})")
    s, schema = api.call("OPTIONS", "/wp/v2/services")
    props = set((schema.get("schema", {}).get("properties", {}) or {}).keys()) if s == 200 else set()
    for necesario in ("title", "slug", "acf", "lang", "translations", "service-categories", "status"):
        if necesario not in props:
            info["ok"] = False
            info["detalle"].append(f"BLOQUEO: falta '{necesario}' en esquema")
    info["detalle"].append("esquema: title/slug/acf/lang/translations/service-categories OK; excerpt/content ausentes (documentado)")
    return info, es, en, terms


def resolver(item, es_idx, en_idx):
    """Devuelve (es_id, en_id, modo, motivo)."""
    slug = norm(item.get("clave", ""))
    es_cand = [x for x in es_idx if norm(x.get("slug", "")) == slug and x.get("lang") == "es"]
    if len(es_cand) > 1:
        return None, None, "AMBIGUOUS", f"slug ES '{slug}' en {len(es_cand)} registros"
    es_rec = es_cand[0] if es_cand else None
    if es_rec is None:
        by_title = [x for x in es_idx if norm((x.get("title") or {}).get("rendered", "")) == norm(item["es"].get("titulo", "")) and x.get("lang") == "es"]
        if len(by_title) > 1:
            return None, None, "AMBIGUOUS", "título ES en varios registros"
        es_rec = by_title[0] if by_title else None
    en_rec = None
    if es_rec:
        link = (es_rec.get("translations") or {}).get("en")
        if isinstance(link, int):
            en_rec = next((x for x in en_idx if x["id"] == link), None)
            if en_rec is None:
                return es_rec["id"], None, "AMBIGUOUS", "enlace translations roto"
            back = (en_rec.get("translations") or {}).get("es")
            if back != es_rec["id"]:
                return es_rec["id"], en_rec["id"], "AMBIGUOUS", "relación de traducción inconsistente"
    if en_rec is None:
        by_title = [x for x in en_idx if norm((x.get("title") or {}).get("rendered", "")) == norm(item["en"].get("titulo", "")) and x.get("lang") == "en"]
        if len(by_title) > 1:
            return (es_rec["id"] if es_rec else None), None, "AMBIGUOUS", "título EN en varios registros"
        en_rec = by_title[0] if by_title else None
    return (es_rec["id"] if es_rec else None), (en_rec["id"] if en_rec else None), "OK", ""


def verificar(api, sid, esperado, lado):
    s, vivo = api.call("GET", f"/wp/v2/services/{sid}?_fields=id,title,acf,service-categories,lang,status")
    if s != 200 or not isinstance(vivo, dict):
        return False, f"relectura HTTP {s}"
    if norm((vivo.get("title") or {}).get("rendered", "")) != norm(esperado.get("titulo", "")):
        return False, "título difiere"
    acf_vivo, acf_esp = vivo.get("acf") or {}, esperado.get("acf") or {}
    for k in ("intro_title", "development_title", "solutions_title", "approach_title", "tech_title"):
        if norm(str(acf_vivo.get(k, ""))) != norm(str(acf_esp.get(k, ""))):
            return False, f"acf.{k} difiere"
    for rep in ("hero_stats", "solutions", "approach", "tech_groups", "faq_items", "development_tags"):
        lv, ev = acf_vivo.get(rep) or [], acf_esp.get(rep) or []
        if len(lv) != len(ev):
            return False, f"acf.{rep}: {len(lv)} vs {len(ev)}"
    return True, f"titulo+acf verificados (id {sid}, status {vivo.get('status')})"


def importar(api, lote, es_idx, en_idx, terms):
    term_id = {}
    for t in terms:
        term_id.setdefault(norm(t.get("name", "")), t["id"])
    reporte = []
    for item in lote["items"]:
        clave = item["clave"]
        es_id, en_id, modo, motivo = resolver(item, es_idx, en_idx)
        if modo == "AMBIGUOUS":
            reporte.append({"clave": clave, "estado": "AMBIGUOUS", "detalle": motivo})
            continue
        if es_id is None or en_id is None:
            reporte.append({"clave": clave, "estado": "SKIPPED",
                            "detalle": f"sin registro vivo (ES {es_id}, EN {en_id}); no se crea sin requisito aprobado"})
            continue
        cat = norm(item.get("categoria", ""))
        cat_id = term_id.get(cat) if cat else None
        if cat and cat_id is None:
            reporte.append({"clave": clave, "estado": "ERROR", "detalle": f"categoría '{item.get('categoria')}' inexistente (no se crea)"})
            continue
        es_payload = {"title": item["es"]["titulo"], "acf": item["es"]["acf"], "lang": "es"}
        if cat_id:
            es_payload["service-categories"] = [cat_id]
        s, _ = api.call("POST", f"/wp/v2/services/{es_id}", es_payload)
        if s not in (200, 201):
            reporte.append({"clave": clave, "estado": "ERROR", "detalle": f"POST ES {es_id} HTTP {s}"})
            continue
        en_payload = {"title": item["en"]["titulo"], "acf": item["en"]["acf"], "lang": "en"}
        s, _ = api.call("POST", f"/wp/v2/services/{en_id}", en_payload)
        if s not in (200, 201):
            reporte.append({"clave": clave, "estado": "ERROR", "detalle": f"POST EN {en_id} HTTP {s}"})
            continue
        ok_es, det_es = verificar(api, es_id, item["es"], "es")
        ok_en, det_en = verificar(api, en_id, item["en"], "en")
        if ok_es and ok_en:
            reporte.append({"clave": clave, "estado": "UPDATED",
                            "detalle": f"ES {es_id} + EN {en_id}; {det_es}; {det_en}"})
        else:
            reporte.append({"clave": clave, "estado": "ERROR",
                            "detalle": f"verificación: ES [{det_es}] EN [{det_en}]"})
    return reporte


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--base", default="http://gussware.local")
    ap.add_argument("--user", default=None)
    ap.add_argument("--password", default=None)
    ap.add_argument("--lote", default=str(HERE / "servicios.json"))
    ap.add_argument("--reporte", default=str(HERE / "reporte-servicios.md"))
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

    info, es_idx, en_idx, terms = pre_vuelo(api)
    for d in info["detalle"]:
        print("pre-vuelo: " + d)
    if not info["ok"]:
        print("BLOQUEO en pre-vuelo: sin escrituras")
        return 2
    if not args.importar:
        print("pre-vuelo OK (sin escrituras)")
        return 0

    reporte = importar(api, lote, es_idx, en_idx, terms)
    creados = [r for r in reporte if r["estado"] == "CREATED"]
    actualizados = [r for r in reporte if r["estado"] == "UPDATED"]
    omitidos = [r for r in reporte if r["estado"] in ("EXISTING", "SKIPPED")]
    ambiguos = [r for r in reporte if r["estado"] == "AMBIGUOUS"]
    fallidos = [r for r in reporte if r["estado"] == "ERROR"]
    lineas = ["# RGW-329 — Reporte de importación masiva de Servicios", ""]
    for r in reporte:
        lineas.append(f"- {r['clave']}: **{r['estado']}** — {r['detalle']}")
    lineas += ["",
               f"Creados: {len(creados)} | Actualizados: {len(actualizados)} | "
               f"Omitidos: {len(omitidos)} | Ambiguos: {len(ambiguos)} | Fallidos: {len(fallidos)}",
               "Estados de publicación preservados; segunda ejecución idempotente (mismos IDs)."]
    Path(args.reporte).write_text("\n".join(lineas) + "\n")
    print("\n".join(lineas))
    return 0 if not (ambiguos or fallidos) else 1


if __name__ == "__main__":
    sys.exit(main())
