SOURCE_COLUMNS = [
    "id_mutation", "date_mutation", "numero_disposition", "nature_mutation", "valeur_fonciere", "adresse_numero",
    "adresse_suffixe", "adresse_nom_voie", "adresse_code_voie", "code_postal", "code_commune", "nom_commune",
    "code_departement", "ancien_code_commune", "ancien_nom_commune", "id_parcelle", "ancien_id_parcelle",
    "numero_volume", "lot1_numero", "lot1_surface_carrez", "lot2_numero", "lot2_surface_carrez", "lot3_numero",
    "lot3_surface_carrez", "lot4_numero", "lot4_surface_carrez", "lot5_numero", "lot5_surface_carrez", "nombre_lots",
    "code_type_local", "type_local", "surface_reelle_bati", "nombre_pieces_principales", "code_nature_culture",
    "nature_culture", "code_nature_culture_speciale", "nature_culture_speciale", "surface_terrain", "longitude",
    "latitude",
]

TEXT = "nullif({c}, '')"
INTEGER = "round(nullif({c}, '')::numeric)::int"

TARGET = {
    "id_mutation": TEXT, "id_parcelle": "{c}", "date_mutation": "nullif({c}, '')::date",
    "numero_disposition": TEXT, "nature_mutation": TEXT,
    "valeur_fonciere": "case when nullif({c}, '')::numeric < 1e10 then nullif({c}, '')::numeric end",
    "code_commune": TEXT, "adresse_numero": TEXT, "adresse_suffixe": TEXT, "adresse_nom_voie": TEXT,
    "code_postal": TEXT, "lot1_numero": TEXT, "lot1_surface_carrez": "nullif({c}, '')::numeric",
    "lot2_numero": TEXT, "lot2_surface_carrez": "nullif({c}, '')::numeric", "nombre_lots": INTEGER,
    "code_type_local": TEXT, "type_local": TEXT, "surface_reelle_bati": INTEGER,
    "nombre_pieces_principales": INTEGER, "code_nature_culture": TEXT, "nature_culture": TEXT,
    "surface_terrain": INTEGER, "longitude": "nullif({c}, '')::double precision",
    "latitude": "nullif({c}, '')::double precision",
}


def staging_ddl(table: str) -> str:
    return f"drop table if exists {table}; create unlogged table {table} ({', '.join(f'{c} text' for c in SOURCE_COLUMNS)})"


def replace_year_sql(table: str, year: str) -> str:
    expressions = ", ".join(cast.format(c=column) for column, cast in TARGET.items())
    columns = ", ".join(TARGET)
    return f"""
begin;
insert into dvf_mutations ({columns})
select {expressions} from {table} where length(id_parcelle) = 14
except all
select {columns} from dvf_mutations
where date_mutation >= '{year}-01-01' and date_mutation < '{int(year) + 1}-01-01';
commit;
drop table {table};"""
