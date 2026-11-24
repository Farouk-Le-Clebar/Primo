import argparse
import csv
import io

from lib import db
from lib.http import datagouv_dataset, open_url
from lib.rnic_schema import publish_sql
from lib.snapshot import raw_ddl, refresh

SOURCE = "rnic"
DATASET = "62da71c068871f4c54258c7c"
RAW = "src_rnic"
MIN_SIZE = 100_000_000
COPY_CHUNK = 1 << 20


def latest_file() -> str:
    resources = [
        r for r in datagouv_dataset(DATASET)["resources"]
        if r["format"] == "csv" and (r.get("filesize") or 0) > MIN_SIZE
    ]
    return max(resources, key=lambda r: r["last_modified"])["url"]


def download(url: str) -> None:
    with open_url(url) as response:
        text = io.TextIOWrapper(response, encoding="utf-8-sig")
        columns = next(csv.reader([text.readline()]))
        db.execute(raw_ddl(RAW, columns))
        with db.copy_into(RAW, columns) as stream:
            while chunk := text.read(COPY_CHUNK):
                stream.write(chunk)


def main() -> None:
    parser = argparse.ArgumentParser(description="Import du registre national des copropriétés (ANAH)")
    parser.add_argument("--full", action="store_true", help="retélécharger et republier même si à jour")
    args = parser.parse_args()

    db.ensure_state_table()
    url = latest_file()
    refresh(SOURCE, url, RAW, "coproprietes", lambda: download(url), publish_sql(RAW), args.full)


if __name__ == "__main__":
    main()
