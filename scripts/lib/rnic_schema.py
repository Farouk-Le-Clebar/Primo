from lib.snapshot import safe_date, safe_int, text, yes_no

PARCEL_PATTERN = "^[0-9]{5}[0-9A-Z]{3}[0-9A-Z]{2}[0-9]{4}$"

PERIODES = {
    "AVANT_1949": "Avant 1949",
    "DE_1949_A_1960": "De 1949 à 1960",
    "DE_1961_A_1974": "De 1961 à 1974",
    "DE_1975_A_1993": "De 1975 à 1993",
    "DE_1994_A_2000": "De 1994 à 2000",
    "DE_2001_A_2010": "De 2001 à 2010",
    "APRES_2010": "Après 2010",
    "A_COMPTER_DE_2011": "À partir de 2011",
}
UNKNOWN_PERIODES = ("", "INCONNUE", "INCONNU", "NON_CONNUE", "NON CONNU", "NON CONNUE", "NON RENSEIGNÉ", "NON RENSEIGNE")


def parcel(n: int) -> str:
    commune, prefix = f"trim(code_insee_parcelle_{n})", f"lpad(trim(prefixe_parcelle_{n}), 3, '0')"
    insee = (
        f"case when {commune} = '75056' and {prefix} ~ '^1[0-2][0-9]$' then '75' || {prefix} || '000' "
        f"when {commune} = '69123' and {prefix} ~ '^38[1-9]$' then '69' || {prefix} || '000' "
        f"else {commune} || {prefix} end"
    )
    built = f"{insee} || lpad(upper(trim(section_parcelle_{n})), 2, '0') || lpad(trim(numero_parcelle_{n}), 4, '0')"
    return f"case when ({built}) ~ '{PARCEL_PATTERN}' then {built} end"


def periode(column: str) -> str:
    cases = " ".join(f"when '{code}' then '{label}'" for code, label in PERIODES.items())
    unknown = ", ".join(f"'{value}'" for value in UNKNOWN_PERIODES)
    value = f"upper(trim({column}))"
    return f"case when {value} in ({unknown}) then null else case {value} {cases} else trim({column}) end end"


TARGET = {
    "numero_immatriculation": "trim(numero_immatriculation)",
    "nom_usage": text("nom_usage_copropriete"),
    "adresse_reference": text("adresse_reference"),
    "code_commune": text("code_officiel_commune"),
    "id_parcelle_1": parcel(1),
    "id_parcelle_2": parcel(2),
    "id_parcelle_3": parcel(3),
    "nombre_parcelles": safe_int("nombre_parcelles"),
    "date_immatriculation": safe_date("date_immatriculation"),
    "date_derniere_maj": safe_date("date_derniere_maj"),
    "date_reglement": safe_date("date_reglement_copropriete"),
    "periode_construction": periode("periode_construction"),
    "type_syndic": text("type_syndic"),
    "syndic": text("raison_sociale_representant_legal"),
    "mandat": text("mandat_en_cours"),
    "date_fin_mandat": safe_date("date_fin_dernier_mandat"),
    "nombre_lots": safe_int("nombre_total_lots"),
    "nombre_lots_principaux": safe_int("nombre_lots_habitation_bureaux_commerces"),
    "nombre_lots_habitation": safe_int("nombre_lots_habitation"),
    "nombre_lots_stationnement": safe_int("nombre_lots_stationnement"),
    "residence_service": yes_no("residence_service"),
    "syndicat_principal": yes_no("syndicat_principal_ou_secondaire"),
    "copro_aidee": yes_no("copro_aidee"),
    "quartier_prioritaire": text("nom_qp_2024"),
    "geom": "case when longitude ~ '^-?[0-9.]+$' and latitude ~ '^-?[0-9.]+$' "
    "then ST_SetSRID(ST_MakePoint(longitude::double precision, latitude::double precision), 4326) end",
}


def publish_sql(raw_table: str) -> str:
    return f"""
insert into coproprietes ({', '.join(TARGET)})
select distinct on (trim(numero_immatriculation)) {', '.join(TARGET.values())}
from {raw_table} where trim(numero_immatriculation) <> ''
order by trim(numero_immatriculation), date_derniere_maj desc"""
