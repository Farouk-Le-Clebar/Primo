import argparse
import csv
import io

from lib import db
from lib.http import open_url
from lib.sitadel_schema import DIDO, FILES, META_COLUMNS, column_types, finish_sql, latest, table_ddl

SOURCE = "sitadel"
TARGET = "autorisations_urbanisme"
STAGING = "autorisations_urbanisme_new"
FIXED_TYPE = {"amenagements": "PA", "demolitions": "PD"}


def load(kind: str, version: dict, fields: list[str]) -> int:
    url = f"{DIDO}/datafiles/{FILES[kind]}/csv?millesime={version['millesime']}"
    count = 0
    with open_url(url, timeout=600) as response, db.copy_into(STAGING, META_COLUMNS + [f.lower() for f in fields]) as stream:
        reader = csv.DictReader(io.TextIOWrapper(response, encoding="utf-8-sig", newline=""), delimiter=";")
        if set(reader.fieldnames or []) != {c["name"] for c in version["columns"]}:
            raise RuntimeError(f"Colonnes du fichier {kind} différentes du catalogue")
        writer = csv.writer(stream)
        for row in reader:
            kind_code = FIXED_TYPE.get(kind) or row.get("TYPE_DAU")
            number = row.get("NUM_DAU") or row.get("NUM_PA") or row.get("NUM_PD")
            state = row.get("ETAT_DAU") or row.get("ETAT_PA") or row.get("ETAT_PD")
            if not number or kind_code not in ("PC", "DP", "PA", "PD"):
                raise RuntimeError(f"Ligne {kind} sans numéro ou type : {count + 1}")
            writer.writerow([kind, kind_code, number, state, version["millesime"]] + [row.get(f) for f in fields])
            count += 1
            if count % 500_000 == 0:
                print(f"  {kind} : {count} lignes…", flush=True)
    if count != version["rows"]:
        raise RuntimeError(f"{kind} : {count} lignes lues, {version['rows']} annoncées par le SDES")
    return count


def main() -> None:
    parser = argparse.ArgumentParser(description="Import des autorisations d'urbanisme Sitadel (SDES)")
    parser.add_argument("--full", action="store_true", help="réimporter même si le millésime est déjà en base")
    args = parser.parse_args()

    db.ensure_state_table()
    versions = latest()
    label = " ".join(f"{kind}:{v['millesime']}" for kind, v in versions.items())
    if not args.full and db.get_state(SOURCE, "publie") == label and db.table_exists(TARGET):
        return print(f"{SOURCE} : à jour ({label})", flush=True)

    types = column_types(versions)
    db.execute(table_ddl(STAGING, types))
    total = 0
    for kind, version in versions.items():
        print(f"{SOURCE} : {kind} {version['millesime']} ({version['rows']} lignes)…", flush=True)
        total += load(kind, version, list(types))
    print(f"{SOURCE} : index et mise en service…", flush=True)
    db.execute(finish_sql(STAGING, TARGET))
    db.set_state(SOURCE, "publie", label, total)
    print(f"{SOURCE} : {total} autorisations publiées dans {TARGET}", flush=True)


if __name__ == "__main__":
    main()
