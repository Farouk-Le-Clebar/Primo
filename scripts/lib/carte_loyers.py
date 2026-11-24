import csv
import io
import re
from typing import Iterator

from lib.http import datagouv_search, open_url
from lib.snapshot import safe_decimal, safe_int

QUERY = "Carte des loyers indicateurs de loyers d'annonce par commune"
TITLE = re.compile(r"carte des loyers.*par commune en (20\d{2})", re.IGNORECASE)
FILES = {"pred-app12-": "appartement_t1_t2", "pred-app3-": "appartement_t3_plus", "pred-app-": "appartement", "pred-mai-": "maison"}
RAW_COLUMNS = ["code_commune", "type_bien", "annee", "loyer_m2", "loyer_m2_bas", "loyer_m2_haut", "echelle", "nombre_annonces"]


def latest_dataset() -> tuple[int, dict]:
    found = [(int(m.group(1)), d) for d in datagouv_search(QUERY) if (m := TITLE.search(d["title"]))]
    return max(found, key=lambda item: item[0])


def kind_of(url: str) -> str | None:
    name = url.rsplit("/", 1)[-1]
    return next((kind for prefix, kind in FILES.items() if name.startswith(prefix)), None)


def decode(raw: bytes) -> str:
    try:
        return raw.decode("utf-8-sig")
    except UnicodeDecodeError:
        return raw.decode("cp1252")


def rows(year: int, dataset: dict) -> Iterator[list[str]]:
    for resource in dataset["resources"]:
        kind = kind_of(resource["url"])
        if resource["format"] != "csv" or not kind:
            continue
        with open_url(resource["url"]) as response:
            reader = csv.DictReader(io.StringIO(decode(response.read())), delimiter=";")
            for row in reader:
                yield [row["INSEE_C"], kind, str(year), row["loypredm2"], row["lwr.IPm2"], row["upr.IPm2"],
                       row["TYPPRED"], row["nbobs_com"]]


def publish_sql(raw_table: str) -> str:
    return f"""
insert into loyers_communes ({', '.join(RAW_COLUMNS)})
select distinct on (code_commune, type_bien) code_commune, type_bien, annee::int, {safe_decimal('loyer_m2')},
  {safe_decimal('loyer_m2_bas')}, {safe_decimal('loyer_m2_haut')}, nullif(echelle, ''), {safe_int('nombre_annonces')}
from {raw_table} where code_commune ~ '^[0-9AB]{{5}}$' and {safe_decimal('loyer_m2')} is not null
order by code_commune, type_bien"""
