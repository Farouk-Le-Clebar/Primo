from typing import Callable

from lib import db


def raw_ddl(table: str, columns: list[str]) -> str:
    return f"drop table if exists {table}; create table {table} ({', '.join(f'{c} text' for c in columns)})"


def safe_int(column: str) -> str:
    return f"case when trim({column}) ~ '^-?[0-9]+$' then trim({column})::int end"


def safe_decimal(column: str) -> str:
    value = f"replace(trim({column}), ',', '.')"
    return f"case when {value} ~ '^-?[0-9]+(\\.[0-9]+)?$' then {value}::numeric end"


def safe_date(column: str) -> str:
    return f"case when {column} ~ '^[0-9]{{4}}-[0-9]{{2}}-[0-9]{{2}}$' then {column}::date end"


def yes_no(column: str) -> str:
    return f"case lower(trim({column})) when 'oui' then true when 'non' then false end"


def text(column: str) -> str:
    return f"nullif(nullif(trim({column}), ''), 'non connu')"


def refresh(
    source: str,
    version: str,
    raw_table: str,
    target: str,
    download: Callable[[], None],
    publish_sql: str,
    full: bool = False,
    scope: str = "true",
) -> None:
    if not full and db.get_state(source, "publie") == version:
        return print(f"{source} : à jour ({version})", flush=True)
    if full or db.get_state(source, "brut") != version or not db.table_exists(raw_table):
        print(f"{source} : téléchargement ({version})…", flush=True)
        download()
        rows = int(db.value(f"select count(*) from {raw_table}"))
        db.set_state(source, "brut", version, rows)
        print(f"{source} : {rows} lignes brutes dans {raw_table}", flush=True)
    if not db.table_exists(target):
        return print(f"{source} : table {target} absente · déployer l’entité puis relancer", flush=True)
    print(f"{source} : publication dans {target}…", flush=True)
    db.execute(f"begin; delete from {target} where {scope}; {publish_sql}; commit;")
    count = int(db.value(f"select count(*) from {target} where {scope}"))
    db.set_state(source, "publie", version, count)
    db.execute(f"drop table {raw_table}")
    db.execute(f"analyze {target}")
    print(f"{source} : {count} lignes publiées", flush=True)
