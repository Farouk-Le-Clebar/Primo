from lib.snapshot import safe_decimal, safe_int, text

SOURCE_COLUMNS = [
    "DEP_CODE", "DEPCOM", "CODEPOSTAL", "NUMVOIE", "INDREP", "TYPVOIE", "NOMVOIE", "ETAGE", "COMPLGEO", "QPV_LIBELLE",
    "TYPECONST_LIBELLE", "NBPIECE", "SURFHAB", "CONSTRUCT", "LOCAT", "FINAN_LIBELLE", "CONV", "DPEDATE",
    "DPEENERGIE", "DPESERRE", "PMR_LIBELLE", "EPSG", "X", "Y", "QUALITE_XY",
]

LETTER = "case when upper(trim({c})) ~ '^[A-G]$' then upper(trim({c})) end"
POINT = (
    "case when x ~ '^-?[0-9.]+$' and y ~ '^-?[0-9.]+$' and epsg in (select srid::text from spatial_ref_sys) "
    "then ST_Transform(ST_SetSRID(ST_MakePoint(x::double precision, y::double precision), epsg::int), 4326) end"
)

TARGET = {
    "code_commune": text("depcom"),
    "adresse": "nullif(trim(concat_ws(' ', nullif(numvoie, '0'), indrep, typvoie, nomvoie)), '')",
    "code_postal": text("codepostal"),
    "nom_programme": text("complgeo"),
    "etage": safe_int("etage"),
    "nombre_pieces": safe_int("nbpiece"),
    "surface_habitable": f"nullif({safe_decimal('surfhab')}, 0)",
    "annee_construction": safe_int("construct"),
    "annee_mise_en_location": safe_int("locat"),
    "type_construction": text("typeconst_libelle"),
    "financement": text("finan_libelle"),
    "conventionne": "case trim(conv) when '1' then true when '2' then false end",
    "dpe_energie": LETTER.format(c="dpeenergie"),
    "dpe_ges": LETTER.format(c="dpeserre"),
    "dpe_date": text("dpedate"),
    "accessibilite_pmr": text("pmr_libelle"),
    "quartier_prioritaire": text("qpv_libelle"),
    "qualite_geolocalisation": text("qualite_xy"),
    "geom": POINT,
}


def publish_sql(raw_table: str) -> str:
    return f"insert into rpls_logements ({', '.join(TARGET)}) select {', '.join(TARGET.values())} from {raw_table}"
