import argparse
import http.client
import io
import time
import urllib.parse

from lib import db
from lib.http import fetch_json, open_url
from lib.rpls_schema import SOURCE_COLUMNS, publish_sql
from lib.snapshot import raw_ddl, refresh

SOURCE = "rpls"
PROGRESS = "rpls-departement"
DATAFILE = "https://data.statistiques.developpement-durable.gouv.fr/dido/api/v1/datafiles/f3c2f2cb-8fb1-40fd-8733-964247744c9a"
RAW = "src_rpls"
COPY_CHUNK = 1 << 20
MAX_ATTEMPTS = 6
DEPARTMENTS = [f"{n:02d}" for n in range(1, 96) if n != 20] + ["2A", "2B", "971", "972", "973", "974", "976"]


def load_department(millesime: str, departement: str) -> None:
    params = urllib.parse.urlencode({
        "millesime": millesime, "withColumnName": "true", "withColumnDescription": "false",
        "withColumnUnit": "false", "columns": ",".join(SOURCE_COLUMNS), "DEP_CODE": f"eq:{departement}",
    })
    db.execute(f"delete from {RAW} where dep_code = {db.literal(departement)}")
    with open_url(f"{DATAFILE}/csv?{params}", timeout=600) as response, db.copy_into(RAW, SOURCE_COLUMNS, ";") as stream:
        text = io.TextIOWrapper(response, encoding="utf-8-sig")
        text.readline()
        while chunk := text.read(COPY_CHUNK):
            stream.write(chunk)


def download(millesime: str) -> None:
    if db.get_state(SOURCE, "brut-en-cours") != millesime or not db.table_exists(RAW):
        db.execute(raw_ddl(RAW, SOURCE_COLUMNS))
        db.clear_state(PROGRESS)
        db.set_state(SOURCE, "brut-en-cours", millesime, 0)
    for departement in DEPARTMENTS:
        if db.get_state(PROGRESS, departement) == millesime:
            continue
        for attempt in range(MAX_ATTEMPTS):
            try:
                load_department(millesime, departement)
                break
            except (http.client.HTTPException, OSError, RuntimeError) as error:
                print(f"  {departement} : {error!r} · nouvel essai", flush=True)
                time.sleep(2 ** attempt)
        else:
            raise RuntimeError(f"Échec définitif du département {departement}")
        count = db.value(f"select count(*) from {RAW} where dep_code = {db.literal(departement)}")
        db.set_state(PROGRESS, departement, millesime, int(count))
        print(f"  {departement} : {count} logements", flush=True)
    db.clear_state(PROGRESS)


def main() -> None:
    parser = argparse.ArgumentParser(description="Import des logements sociaux au logement (RPLS, SDES)")
    parser.add_argument("--full", action="store_true", help="retélécharger et republier même si à jour")
    args = parser.parse_args()

    db.ensure_state_table()
    millesime = fetch_json(DATAFILE)["millesime"]
    refresh(SOURCE, millesime, RAW, "rpls_logements", lambda: download(millesime), publish_sql(RAW), args.full)


if __name__ == "__main__":
    main()
