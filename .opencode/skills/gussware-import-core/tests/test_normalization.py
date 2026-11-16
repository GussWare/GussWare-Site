"""Tests for the shared Normalization block (gussware-import-core).

Mirrors the block's rules exactly: NFC composition, whitespace collapse,
case-insensitive compare, significant accents, slug derivation/collisions,
and resolve-or-create decisions for both importers (Servicios y Proyectos).

Covers the required variants: Php/PHP, extra whitespace, Unicode,
and slug collisions. Also asserts the 8 shared blocks stay byte-identical
across core + both adapters.

Run:  python3 .opencode/skills/gussware-import-core/tests/test_normalization.py
Exit code 0 = all pass. Read-only: no WordPress calls, no writes.
"""

import pathlib
import re
import sys
import unicodedata

SKILLS_DIR = pathlib.Path(__file__).resolve().parents[2]
CORE = SKILLS_DIR / "gussware-import-core" / "SKILL.md"
SERVICES = SKILLS_DIR / "gussware-services-import" / "SKILL.md"
PROJECTS = SKILLS_DIR / "gussware-projects-import" / "SKILL.md"

PASS = []
FAIL = []


def check(name, condition):
    (PASS if condition else FAIL).append(name)
    print(("PASS " if condition else "FAIL ") + name)


def norm(s):
    """Python mirror of norm(s) from the Normalization block."""
    if not isinstance(s, str):
        return None
    s = unicodedata.normalize("NFC", s)
    s = re.sub(r"\s+", " ", s).strip()
    if not s:
        return None
    return s.casefold()


def slugify(s):
    """Platform slug rule mirror: lowercase, accent-transliterated, '-' joined."""
    if not isinstance(s, str):
        return ""
    s = unicodedata.normalize("NFKD", s)
    s = "".join(c for c in s if not unicodedata.combining(c))
    s = re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")
    return s


def resolve(terms, source_name, anchor_slug=None, query_lang=None):
    """Mirror of the block's Resolution within one language.

    terms: [{id, name, slug, lang?}]. lang None = legacy record with no
    assigned language: participates as a candidate in every language,
    without being treated as a translation. Returns (decision, payload).
    Decisions: reuse | create | ambiguous | slug_collision | invalid.
    """
    if anchor_slug:
        hits = [t for t in terms if t["slug"] == anchor_slug]
        if len(hits) == 1 and norm(hits[0]["name"]) == norm(source_name):
            return ("reuse", hits[0]["id"])
        return ("slug_collision", anchor_slug)
    key = norm(source_name)
    if key is None:
        return ("invalid", None)
    candidates = [t for t in terms if t.get("lang", query_lang) in (query_lang, None)]
    hits = [t for t in candidates if norm(t["name"]) == key]
    if len(hits) == 1:
        return ("reuse", hits[0]["id"])
    if len(hits) > 1:
        return ("ambiguous", [t["id"] for t in hits])
    derived = slugify(source_name)
    if not derived:
        return ("invalid", None)
    if any(t["slug"] == derived and norm(t["name"]) != key for t in terms):
        return ("slug_collision", derived)
    return ("create", derived)


def blocks_of(text):
    return dict(
        re.findall(r"INICIO: ([\w-]+) -->(.*?)FIN: \1 -->", text, re.S)
    )


# Fixtures mirroring both importers (Servicios + Proyectos shapes).
SERVICES_TERMS = [
    {"id": 41, "name": "Consultoría técnica", "slug": "consultoria-tecnica"},
    {"id": 43, "name": "Diseño web", "slug": "diseno-web"},
]
PROJECTS_TECH = [
    {"id": 34, "name": "Php", "slug": "php"},
    {"id": 66, "name": "MySQL", "slug": "mysql"},
]
PROJECTS_TYPES = [
    {"id": 62, "name": "Sistemas empresariales", "slug": "sistemas-empresariales"},
]


def main():
    # 1. Case-insensitivity: Php / PHP (required variant).
    check("php_equals_PHP", norm("Php") == norm("PHP"))
    check("resolve_PHP_reuses_34", resolve(PROJECTS_TECH, "PHP") == ("reuse", 34))

    # 2. Surrounding / interior whitespace (required variant).
    check("trim_and_collapse", norm("  MySQL\t") == norm("mysql"))
    check("interior_collapse", norm("Sistemas  empresariales") == norm("Sistemas empresariales"))
    check("nbsp_collapse", norm("MySQL ") == norm("MySQL"))
    check(
        "resolve_padded_reuses_62",
        resolve(PROJECTS_TYPES, "  Sistemas   empresariales ") == ("reuse", 62),
    )

    # 3. Unicode NFC equivalence (required variant).
    check("nfc_equal", norm("Café") == norm("Café"))
    check("casefold_stable", norm("İ") == norm("i̇"))

    # 4. Accents are significant: never auto-merge.
    check("accents_differ", norm("papa") != norm("papá"))
    dupes = [
        {"id": 1, "name": "papa", "slug": "papa"},
        {"id": 2, "name": "papá", "slug": "papa-2"},
    ]
    check("accent_exact_reuse", resolve(dupes, "papá") == ("reuse", 2))
    check(
        "accent_ambiguous_no_pick",
        resolve(
            [{"id": 1, "name": "Papa", "slug": "papa"}, {"id": 2, "name": "PAPA", "slug": "papa-2"}],
            "papa",
        )[0]
        == "ambiguous",
    )

    # 5. Empty values never match.
    check("empty_none", norm("   ") is None)
    check("empty_invalid", resolve(PROJECTS_TECH, "   ")[0] == "invalid")
    check("nonstring_invalid", resolve(PROJECTS_TECH, None)[0] == "invalid")

    # 6. Slug derivation + collisions (required variant).
    check("slug_basic", slugify("Sistemas empresariales") == "sistemas-empresariales")
    check("slug_accents", slugify("Consultoría técnica") == "consultoria-tecnica")
    check("slug_php", slugify("PHP") == "php")
    check(
        "slug_collision",
        resolve(
            [{"id": 7, "name": "Lenguaje PHP alternativo", "slug": "php"}],
            "PHP!!!",
        )
        == ("slug_collision", "php"),
    )
    check(
        "slug_collision_exact",
        resolve(
            [{"id": 7, "name": "Otro término", "slug": "mysql"}],
            "MySQL!!",
        )
        == ("slug_collision", "mysql"),
    )

    # 7. Resolve-or-create across both importers.
    check(
        "services_reuse",
        resolve(SERVICES_TERMS, "consultoría TÉCNICA") == ("reuse", 41),
    )
    check(
        "services_create",
        resolve(SERVICES_TERMS, "Soporte nuevo") == ("create", "soporte-nuevo"),
    )
    check(
        "projects_create",
        resolve(PROJECTS_TECH, "PostgreSQL") == ("create", "postgresql"),
    )

    # 8. Explicit anchor wins; anchor mismatch stops.
    check(
        "anchor_reuse",
        resolve(PROJECTS_TECH, "MySQL", anchor_slug="mysql") == ("reuse", 66),
    )
    check(
        "anchor_mismatch_stops",
        resolve(PROJECTS_TECH, "Otro", anchor_slug="mysql")[0] == "slug_collision",
    )

    # 9. Retry convergence: second run reuses, creates nothing.
    store = list(PROJECTS_TYPES)
    first = resolve(store, "Comercio Nuevo")
    check("first_run_creates", first == ("create", "comercio-nuevo"))
    store.append({"id": 99, "name": "Comercio Nuevo", "slug": "comercio-nuevo"})
    check("second_run_reuses", resolve(store, "comercio nuevo") == ("reuse", 99))

    # 10. Shared blocks byte-identical across core + both adapters.
    core, svc, prj = (blocks_of(p.read_text()) for p in (CORE, SERVICES, PROJECTS))
    expected = {
        "integration",
        "languages",
        "detection",
        "create-link",
        "categories",
        "status",
        "failure",
        "normalization",
    }
    check("block_sets", set(core) == set(svc) == set(prj) == expected)
    for name in sorted(expected):
        check(f"block_{name}_identical", core[name] == svc[name] == prj[name])
    check(
        "normalization_covers_legacy",
        all("lang: false" in b["normalization"] for b in (core, svc, prj)),
    )

    # 11. Legacy records with no assigned language (live case: Php id 34).
    LEGACY_TECH = [
        {"id": 34, "name": "Php", "slug": "php", "lang": None},
        {"id": 66, "name": "MySQL", "slug": "mysql", "lang": "es"},
    ]
    check(
        "legacy_php_reused",
        resolve(LEGACY_TECH, "PHP", query_lang="es") == ("reuse", 34),
    )
    check(
        "legacy_plus_lang_ambiguous",
        resolve(
            LEGACY_TECH + [{"id": 90, "name": "PHP", "slug": "php-2", "lang": "es"}],
            "PHP",
            query_lang="es",
        )
        == ("ambiguous", [34, 90]),
    )
    check(
        "legacy_no_match_not_reused",
        resolve(LEGACY_TECH, "PostgreSQL", query_lang="es")
        == ("create", "postgresql"),
    )
    check(
        "legacy_other_lang_excluded",
        resolve(
            LEGACY_TECH + [{"id": 91, "name": "MySQL", "slug": "mysql-en", "lang": "en"}],
            "mysql",
            query_lang="es",
        )
        == ("reuse", 66),
    )

    print(f"\n{len(PASS)} passed, {len(FAIL)} failed")
    return 1 if FAIL else 0


if __name__ == "__main__":
    sys.exit(main())
