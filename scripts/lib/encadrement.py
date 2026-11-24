import json
import re
import urllib.parse
from typing import Iterator

from lib.http import datagouv_search, fetch_json
from lib.snapshot import safe_decimal, safe_int

PARIS_API = "https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/logement-encadrement-des-loyers"
LYON_QUERY = "Encadrement des loyers de la Métropole de Lyon"
LYON_TITLE = re.compile(r"Métropole de Lyon (20\d{2}-20\d{2})")
RAW_COLUMNS = [
    "territoire", "periode", "zone", "nombre_pieces", "epoque", "annee_min", "annee_max", "meuble",
    "loyer_reference", "loyer_majore", "loyer_minore", "geojson",
]


def epoque_bounds(label: str) -> tuple[str, str]:
    years = [int(y) for y in re.findall(r"\d{4}", label)]
    lowered = label.lower()
    if "avant" in lowered:
        return "", str(years[0] - 1)
    if "apr" in lowered:
        return str(years[0] + 1), ""
    return str(years[0]), str(years[-1])


def row(territoire: str, periode: str, zone: str, pieces: str, epoque: str, meuble: str, ref, high, low, geometry) -> list[str]:
    return [territoire, periode, zone, re.match(r"\d+", str(pieces)).group(), epoque, *epoque_bounds(epoque),
            str(not meuble.lower().startswith("non")).lower(), str(ref), str(high), str(low), json.dumps(geometry)]


def paris_year() -> str:
    groups = fetch_json(f"{PARIS_API}/records?group_by=annee&limit=100")["results"]
    return max(g["annee"] for g in groups)


def paris_rows(year: str) -> Iterator[list[str]]:
    where = urllib.parse.urlencode({"where": f'annee="{year}"'})
    for feature in fetch_json(f"{PARIS_API}/exports/geojson?{where}")["features"]:
        p = feature["properties"]
        yield row("paris", year, p["nom_quartier"], p["piece"], p["epoque"], p["meuble_txt"],
                  p["ref"], p["max"], p["min"], feature["geometry"])


def lyon_source() -> tuple[str, str]:
    found = [(m.group(1), d) for d in datagouv_search(LYON_QUERY) if (m := LYON_TITLE.search(d["title"]))]
    periode, dataset = max(found, key=lambda item: item[0])
    url = next(r["url"] for r in dataset["resources"] if r["format"] == "geojson")
    return periode, url


def lyon_rows(periode: str, url: str) -> Iterator[list[str]]:
    for feature in fetch_json(url)["features"]:
        p = feature["properties"]
        for pieces, epoques in p["valeurs"].items():
            for epoque, types in epoques.items():
                for meuble, v in types.items():
                    yield row("lyon", periode, f"{p['commune']} · IRIS {p['codeiris']}", pieces, epoque, meuble,
                              v["loyer_reference"], v["loyer_reference_majore"], v["loyer_reference_minore"],
                              feature["geometry"])


def publish_sql(raw_table: str) -> str:
    columns = RAW_COLUMNS[:-1]
    values = [
        "territoire", "periode", "zone", "nombre_pieces::int", "epoque", safe_int("annee_min"),
        safe_int("annee_max"), "meuble::boolean", safe_decimal("loyer_reference"), safe_decimal("loyer_majore"),
        safe_decimal("loyer_minore"),
    ]
    return f"""
insert into encadrement_loyers ({', '.join(columns)}, geom)
select {', '.join(values)}, ST_Multi(ST_SetSRID(ST_GeomFromGeoJSON(geojson), 4326)) from {raw_table}"""
