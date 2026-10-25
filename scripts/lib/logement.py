import re

ORDINAL = r"(?:er|ere|ère|eme|ème|e|°|é)?"
FLOOR_WORD = r"(?:étage|etage|etg|étg|ét\b|et\b)"
GROUND = re.compile(r"\b(?:rdc|rez[\s-]*de[\s-]*chauss[ée]e|rez)\b", re.IGNORECASE)
FLOOR_AFTER = re.compile(rf"\b(\d{{1,2}})\s*{ORDINAL}\s*{FLOOR_WORD}", re.IGNORECASE)
FLOOR_BEFORE = re.compile(rf"{FLOOR_WORD}\.?\s*(?:n°|no|:)?\s*(rdc|\d{{1,2}})\s*{ORDINAL}\b", re.IGNORECASE)
DOOR_WORD = r"(?:porte|appartement|appart|appt|apt|app|logement|lgt|log|lot)"
DOOR = re.compile(
    rf"\b{DOOR_WORD}\.?\s*(?:n°|no|num[ée]ro|num|:|#)?\s*([0-9]+[a-z]?|[a-z][0-9]+|[a-z])\b(?!\s*{ORDINAL}\s*{FLOOR_WORD})",
    re.IGNORECASE,
)
LEVEL_CODE = re.compile(r"\bR\s*\+\s*(\d{1,2})\b", re.IGNORECASE)
BARE_DOOR = re.compile(r"^\s*(\d{1,4}[a-z]?)\s*$", re.IGNORECASE)


def parse_floor(complement: str, numero_etage: str) -> str:
    text = complement or ""
    if GROUND.search(text) and not FLOOR_AFTER.search(text):
        return "0"
    for pattern in (FLOOR_AFTER, FLOOR_BEFORE, LEVEL_CODE):
        match = pattern.search(text)
        if match:
            value = match.group(1).lower()
            return "0" if value == "rdc" else str(int(value))
    try:
        floor = int(float(numero_etage))
    except (TypeError, ValueError):
        return ""
    return str(floor) if floor > 0 else ""


def parse_door(complement: str) -> str:
    text = complement or ""
    match = DOOR.search(text) or BARE_DOOR.match(text)
    return match.group(1).upper() if match else ""
