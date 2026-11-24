import csv
import io
import json
import sys
import time
import urllib.parse
import urllib.request
from typing import Iterator

MAX_RETRIES = 8
ADEME_API = "https://data.ademe.fr/data-fair/api/v1/datasets"
DATAGOUV_API = "https://www.data.gouv.fr/api/1"


def open_url(url: str, method: str = "GET", timeout: int = 180):
    for attempt in range(MAX_RETRIES):
        try:
            return urllib.request.urlopen(urllib.request.Request(url, method=method), timeout=timeout)
        except Exception as error:
            wait = 2 ** attempt
            print(f"  {error} · nouvel essai dans {wait}s", file=sys.stderr, flush=True)
            time.sleep(wait)
    raise RuntimeError(f"Échec définitif : {url}")


def last_modified(url: str) -> str:
    with open_url(url, method="HEAD") as response:
        return response.headers.get("Last-Modified") or ""


def ademe_rows(dataset: str, fields: list[str], query: str) -> Iterator[dict[str, str]]:
    params = urllib.parse.urlencode({"size": 10000, "format": "csv", "select": ",".join(fields), "qs": query})
    url: str | None = f"{ADEME_API}/{dataset}/lines?{params}"
    while url:
        with open_url(url) as response:
            body = response.read().decode("utf-8-sig")
            link = response.headers.get("link") or ""
        reader = csv.reader(io.StringIO(body))
        header = next(reader, [])
        if len(header) != len(fields):
            raise RuntimeError(f"Colonnes inattendues : {header}")
        for values in reader:
            yield dict(zip(fields, values))
        url = link.split(";")[0].strip("<> ") if 'rel="next"' in link or "rel=next" in link else None


def fetch_json(url: str):
    with open_url(url) as response:
        return json.loads(response.read().decode("utf-8"))


def datagouv_dataset(dataset: str) -> dict:
    return fetch_json(f"{DATAGOUV_API}/datasets/{dataset}/")


def datagouv_search(query: str) -> list[dict]:
    return fetch_json(f"{DATAGOUV_API}/datasets/?{urllib.parse.urlencode({'q': query, 'page_size': 50})}")["data"]
