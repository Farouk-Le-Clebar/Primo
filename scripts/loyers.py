import argparse
import csv
from typing import Iterable

from lib import carte_loyers, db, encadrement
from lib.snapshot import raw_ddl, refresh


def load(table: str, columns: list[str], rows: Iterable[list[str]]) -> None:
    db.execute(raw_ddl(table, columns))
    with db.copy_into(table, columns) as stream:
        csv.writer(stream).writerows(rows)


def carte(full: bool) -> None:
    year, dataset = carte_loyers.latest_dataset()
    raw = "src_loyers_communes"
    refresh("loyers-communes", f"{year}:{dataset['last_update']}", raw, "loyers_communes",
            lambda: load(raw, carte_loyers.RAW_COLUMNS, carte_loyers.rows(year, dataset)),
            carte_loyers.publish_sql(raw), full)


def paris(full: bool) -> None:
    year = encadrement.paris_year()
    raw = "src_encadrement_paris"
    refresh("encadrement-paris", year, raw, "encadrement_loyers",
            lambda: load(raw, encadrement.RAW_COLUMNS, encadrement.paris_rows(year)),
            encadrement.publish_sql(raw), full, "territoire = 'paris'")


def lyon(full: bool) -> None:
    periode, url = encadrement.lyon_source()
    raw = "src_encadrement_lyon"
    refresh("encadrement-lyon", periode, raw, "encadrement_loyers",
            lambda: load(raw, encadrement.RAW_COLUMNS, encadrement.lyon_rows(periode, url)),
            encadrement.publish_sql(raw), full, "territoire = 'lyon'")


def main() -> None:
    parser = argparse.ArgumentParser(description="Import des loyers : carte des loyers (ANIL) et encadrement (Paris, Lyon)")
    parser.add_argument("--full", action="store_true", help="retélécharger et republier même si à jour")
    args = parser.parse_args()

    db.ensure_state_table()
    for step in (carte, paris, lyon):
        step(args.full)


if __name__ == "__main__":
    main()
