import os
import subprocess
from contextlib import contextmanager
from typing import Iterator, TextIO

CONTAINER = os.environ.get("PRIMO_DB_CONTAINER", "postgis_primo")
USER = os.environ.get("PRIMO_DB_USER", "geo_primo")
NAME = os.environ.get("PRIMO_DB_NAME", "primo")

STATE_TABLE = """
create table if not exists data_import_state (
  source text not null,
  partition text not null,
  version text,
  rows bigint,
  imported_at timestamptz not null default now(),
  primary key (source, partition)
)"""


def _psql(*args: str) -> list[str]:
    return ["docker", "exec", "-i", "-e", "PGOPTIONS=-c client_min_messages=warning", CONTAINER, "psql", "-X", "-q", "-v", "ON_ERROR_STOP=1", "-U", USER, "-d", NAME, *args]


def execute(sql: str) -> None:
    subprocess.run(_psql("-c", sql), check=True)


def value(sql: str) -> str:
    return subprocess.run(_psql("-At", "-c", sql), check=True, capture_output=True, text=True).stdout.strip()


def literal(text: str) -> str:
    return "'" + text.replace("'", "''") + "'"


@contextmanager
def copy_into(table: str, columns: list[str]) -> Iterator[TextIO]:
    command = f"\\copy {table} ({', '.join(columns)}) from stdin with (format csv)"
    process = subprocess.Popen(_psql("-c", command), stdin=subprocess.PIPE, text=True, encoding="utf-8")
    assert process.stdin is not None
    try:
        yield process.stdin
    finally:
        process.stdin.close()
        if process.wait() != 0:
            raise RuntimeError(f"Échec du COPY vers {table}")


def ensure_state_table() -> None:
    execute(STATE_TABLE)


def get_state(source: str, partition: str) -> str | None:
    found = value(
        f"select version from data_import_state where source = {literal(source)} and partition = {literal(partition)}"
    )
    return found or None


def set_state(source: str, partition: str, version: str, rows: int) -> None:
    execute(
        "insert into data_import_state (source, partition, version, rows) values "
        f"({literal(source)}, {literal(partition)}, {literal(version)}, {rows}) "
        "on conflict (source, partition) do update set version = excluded.version, rows = excluded.rows, imported_at = now()"
    )


def clear_state(source: str) -> None:
    execute(f"delete from data_import_state where source = {literal(source)}")


def is_empty(table: str) -> bool:
    return value(f"select not exists (select 1 from {table} limit 1)") == "t"
