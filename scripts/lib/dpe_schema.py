from lib.logement import parse_door, parse_floor

DATASET = "dpe03existant"

SAME_NAME = [
    "numero_dpe", "identifiant_ban", "id_rnb", "etiquette_dpe", "etiquette_ges",
    "coordonnee_cartographique_x_ban", "coordonnee_cartographique_y_ban", "adresse_ban", "code_postal_ban",
    "nom_commune_ban", "score_ban", "annee_construction", "surface_habitable_logement", "type_batiment",
    "date_etablissement_dpe", "date_fin_validite_dpe", "type_installation_chauffage",
    "type_energie_principale_chauffage", "type_installation_ecs", "type_energie_principale_ecs",
    "methode_application_dpe", "qualite_isolation_enveloppe", "qualite_isolation_menuiseries", "type_ventilation",
    "cout_total_5_usages", "numero_etage_appartement", "complement_adresse_logement",
    "complement_adresse_batiment", "nom_residence",
]

RENAMED = {
    "conso_5_usages_ep_m2_an": "conso_5_usages_par_m2_ep",
    "emission_ges_5_usages_m2_an": "emission_ges_5_usages_par_m2",
}

SOURCES = {**{column: column for column in SAME_NAME}, **RENAMED}
DERIVED = ["logement_etage", "logement_porte"]
TABLE_COLUMNS = [*SOURCES, *DERIVED]
TECHNICAL = ["numero_dpe_remplace", "date_derniere_modification_dpe"]
STAGING_COLUMNS = [*TABLE_COLUMNS, *TECHNICAL]
API_FIELDS = [*SOURCES.values(), *TECHNICAL]


def clean(value: str | None) -> str:
    return " ".join((value or "").split())


def to_record(row: dict[str, str]) -> list[str]:
    record = {column: clean(row.get(source)) for column, source in SOURCES.items()}
    record["logement_etage"] = parse_floor(record["complement_adresse_logement"], record["numero_etage_appartement"])
    record["logement_porte"] = parse_door(record["complement_adresse_logement"])
    for column in TECHNICAL:
        record[column] = clean(row.get(column))
    return [record[column] for column in STAGING_COLUMNS]


def staging_ddl(table: str) -> str:
    return f"drop table if exists {table}; create unlogged table {table} ({', '.join(f'{c} text' for c in STAGING_COLUMNS)})"


def merge_sql(table: str) -> str:
    values = ", ".join(f"nullif({c}, '')" for c in TABLE_COLUMNS)
    updates = ", ".join(f"{c} = coalesce(excluded.{c}, dpe.{c})" for c in TABLE_COLUMNS if c != "numero_dpe")
    return f"""
begin;
insert into dpe ({', '.join(TABLE_COLUMNS)})
select distinct on (numero_dpe) {values} from {table} where numero_dpe <> ''
order by numero_dpe, date_derniere_modification_dpe desc
on conflict (numero_dpe) do update set {updates};
commit;
drop table {table};"""
