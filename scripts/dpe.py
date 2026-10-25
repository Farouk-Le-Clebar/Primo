import argparse
import csv
import hashlib
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import date, timedelta

from lib import db
from lib.dpe_schema import API_FIELDS, DATASET, STAGING_COLUMNS, merge_sql, staging_ddl, to_record
from lib.http import ademe_rows

SOURCE = "dpe"
RUN_SOURCE = "dpe-run"
FIRST_MONTH = date(2021, 7, 1)
UNIQUE_INDEX = "IDX_" + hashlib.sha1(b"dpe_numero_dpe").hexdigest()[:26]


def months(start: date, end: date) -> list[tuple[date, date]]:
    periods, current = [], start.replace(day=1)
    while current <= end:
        following = (current.replace(day=28) + timedelta(days=4)).replace(day=1)
        periods.append((max(current, start), min(following - timedelta(days=1), end)))
        current = following
    return periods


def partitions(full: bool, watermark: str | None, today: date) -> list[tuple[str, str]]:
    field = "date_etablissement_dpe" if full else "date_derniere_modification_dpe"
    start = FIRST_MONTH if full else date.fromisoformat(watermark or FIRST_MONTH.isoformat())
    return [(f"{field[:15]}-{first:%Y-%m}", f"{field}:[{first} TO {last}]") for first, last in months(start, today)]


def import_partition(label: str, query: str) -> int:
    table = "dpe_staging_" + label.replace("-", "_")
    db.execute(staging_ddl(table))
    count = 0
    with db.copy_into(table, STAGING_COLUMNS) as stream:
        writer = csv.writer(stream)
        for row in ademe_rows(DATASET, API_FIELDS, query):
            writer.writerow(to_record(row))
            count += 1
    db.execute(merge_sql(table))
    db.set_state(RUN_SOURCE, label, "fait", count)
    return count


def prepare() -> None:
    db.ensure_state_table()
    if not db.value(f"select 1 from pg_indexes where indexname = {db.literal(UNIQUE_INDEX)}"):
        print("Création de l’index unique sur numero_dpe…", flush=True)
        db.execute(f'create unique index concurrently if not exists "{UNIQUE_INDEX}" on dpe (numero_dpe)')


def main() -> None:
    parser = argparse.ArgumentParser(description="Import incrémental des DPE logements existants (ADEME)")
    parser.add_argument("--full", action="store_true", help="tout réimporter depuis juillet 2021")
    parser.add_argument("--workers", type=int, default=4)
    parser.add_argument("--only", help="ne traiter qu’une partition (ex. date_etablissem-2021-07)")
    args = parser.parse_args()

    prepare()
    today = date.today()
    run = db.get_state(SOURCE, "run")
    full = args.full or db.is_empty("dpe") or (run or "").endswith(":full")
    if not run:
        run = f"{today}:{'full' if full else 'delta'}"
        db.clear_state(RUN_SOURCE)
        db.set_state(SOURCE, "run", run, 0)
    started = date.fromisoformat(run.split(":")[0])
    todo = [p for p in partitions(full, db.get_state(SOURCE, "watermark"), today) if not db.get_state(RUN_SOURCE, p[0])]
    if args.only:
        todo = [p for p in todo if p[0] == args.only]
    print(f"Mode {'complet' if full else 'incrémental'} · {len(todo)} partition(s) à traiter", flush=True)

    total = 0
    with ThreadPoolExecutor(max_workers=args.workers) as pool:
        futures = {pool.submit(import_partition, *partition): partition[0] for partition in todo}
        for future in as_completed(futures):
            count = future.result()
            total += count
            print(f"  {futures[future]} : {count} DPE", flush=True)

    if args.only:
        return print(f"Partition {args.only} terminée ({total} DPE).")
    db.set_state(SOURCE, "watermark", (started - timedelta(days=1)).isoformat(), total)
    db.execute(f"delete from data_import_state where source = {db.literal(RUN_SOURCE)} or (source = {db.literal(SOURCE)} and partition = 'run')")
    db.execute("analyze dpe")
    print(f"Terminé : {total} DPE importés ou mis à jour.")


if __name__ == "__main__":
    main()
