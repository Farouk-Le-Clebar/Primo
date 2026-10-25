import argparse
import gzip
import io
import re

from lib import db
from lib.dvf_schema import SOURCE_COLUMNS, replace_year_sql, staging_ddl
from lib.http import last_modified, open_url

SOURCE = "dvf"
BASE_URL = "https://files.data.gouv.fr/geo-dvf/latest/csv"
STAGING = "dvf_staging"
COPY_CHUNK = 1 << 20


def available_years() -> list[str]:
    with open_url(f"{BASE_URL}/") as response:
        listing = response.read().decode("utf-8")
    return sorted(set(re.findall(r'href="[^"]*?(20\d{2})/"', listing)))


def year_count(year: str) -> int:
    return int(db.value(
        f"select count(*) from dvf_mutations where date_mutation >= '{year}-01-01' and date_mutation < '{int(year) + 1}-01-01'"
    ))


def load_year(year: str, version: str) -> int:
    print(f"  {year} : téléchargement et chargement…", flush=True)
    db.execute(staging_ddl(STAGING))
    with open_url(f"{BASE_URL}/{year}/full.csv.gz") as response, db.copy_into(STAGING, SOURCE_COLUMNS) as stream:
        text = io.TextIOWrapper(gzip.GzipFile(fileobj=response), encoding="utf-8")
        text.readline()
        while chunk := text.read(COPY_CHUNK):
            stream.write(chunk)
    db.execute(replace_year_sql(STAGING, year))
    count = year_count(year)
    db.set_state(SOURCE, year, version, count)
    print(f"  {year} : {count} lignes", flush=True)
    return count


def main() -> None:
    parser = argparse.ArgumentParser(description="Import incrémental des DVF géolocalisées (Etalab)")
    parser.add_argument("--full", action="store_true", help="recharger toutes les années disponibles")
    parser.add_argument("--years", nargs="*", help="limiter à certaines années")
    args = parser.parse_args()

    db.ensure_state_table()
    empty = db.is_empty("dvf_mutations")
    years = [y for y in available_years() if not args.years or y in args.years]
    print(f"Années publiées : {', '.join(years)}", flush=True)

    reloaded = 0
    for year in years:
        version = last_modified(f"{BASE_URL}/{year}/full.csv.gz")
        stale = args.full or empty or year_count(year) == 0 or db.get_state(SOURCE, year) != version
        if not stale:
            print(f"  {year} : à jour", flush=True)
            continue
        load_year(year, version)
        reloaded += 1

    if reloaded:
        db.execute("analyze dvf_mutations")
    print(f"Terminé : {reloaded} année(s) rechargée(s).")


if __name__ == "__main__":
    main()
