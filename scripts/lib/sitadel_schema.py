import re
from collections import defaultdict

from lib.http import fetch_json

DIDO = "https://data.statistiques.developpement-durable.gouv.fr/dido/api/v1"
DATASET = "6513f0189d7d312c80ec5b5b"
FILES = {
    "logements": "8b35affb-55fc-4c1f-915b-7750f974446a",
    "locaux": "f8f0700f-806c-40a7-83b1-f21cf507e7c4",
    "amenagements": "96883f50-538b-41f9-a059-c6eb97e6a23a",
    "demolitions": "1a9a2f0c-56fe-4e69-84a7-fbbda2121f02",
}
META_COLUMNS = ["categorie_source", "type_autorisation", "numero_autorisation", "etat_autorisation", "source_millesime"]
INDEXES = {
    "commune_date": "(comm, date_reelle_autorisation desc)",
    "departement_date": "(dep_code, date_reelle_autorisation desc)",
    "numero": "(numero_autorisation)",
    **{f"cadastre{i}": f"(comm, sec_cadastre{i}, num_cadastre{i}) "
                       f"where sec_cadastre{i} is not null and num_cadastre{i} is not null" for i in (1, 2, 3)},
}


def latest() -> dict[str, dict]:
    datafiles = {f["rid"]: f for f in fetch_json(f"{DIDO}/datasets/{DATASET}")["datafiles"]}
    return {kind: max(datafiles[rid]["millesimes"], key=lambda m: m["millesime"]) for kind, rid in FILES.items()}


def column_types(versions: dict[str, dict]) -> dict[str, str]:
    found: dict[str, set[str]] = defaultdict(set)
    for version in versions.values():
        for column in version["columns"]:
            if not re.fullmatch(r"[A-Z][A-Z0-9_]*", column["name"]):
                raise RuntimeError(f"Nom de colonne inattendu : {column['name']}")
            found[column["name"]].add(column["type"])
    resolved = {}
    for name, kinds in sorted(found.items()):
        if "string" in kinds:
            resolved[name] = "text"
        elif kinds == {"integer"}:
            resolved[name] = "bigint"
        elif kinds <= {"integer", "number"}:
            resolved[name] = "numeric"
        elif kinds in ({"boolean"}, {"date"}):
            resolved[name] = kinds.pop()
        else:
            raise RuntimeError(f"Type non géré pour {name} : {kinds}")
    return resolved


def table_ddl(table: str, types: dict[str, str]) -> str:
    columns = ", ".join(f"{name.lower()} {kind}" for name, kind in types.items())
    return f"""drop table if exists {table};
      create table {table} (
        id bigint generated always as identity,
        categorie_source text not null check (categorie_source in ('logements', 'locaux', 'amenagements', 'demolitions')),
        type_autorisation text not null check (type_autorisation in ('PC', 'DP', 'PA', 'PD')),
        numero_autorisation text not null,
        etat_autorisation smallint,
        source_millesime text not null,
        importe_le timestamptz not null default now(),
        {columns})"""


def finish_sql(staging: str, target: str) -> str:
    indexes = "".join(f"create index sitadel_{name}_new on {staging} {spec};" for name, spec in INDEXES.items())
    renames = "".join(f"alter index sitadel_{name}_new rename to sitadel_{name};" for name in INDEXES)
    return f"""alter table {staging} add constraint {staging}_pkey primary key (id);
      {indexes}
      analyze {staging};
      begin;
      drop table if exists {target};
      alter table {staging} rename to {target};
      alter table {target} rename constraint {staging}_pkey to {target}_pkey;
      {renames}
      commit;"""
