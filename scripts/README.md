# Scripts d’import de données ouvertes

À lancer **sur le VPS** (`ssh primoback`), idéalement dans un `screen`. Python 3.10+ (bibliothèque standard uniquement) et accès au conteneur `postgis_primo` via `docker exec`.

| Script | Source | Mise à jour conseillée |
|---|---|---|
| `dpe.py` | ADEME · DPE logements existants (depuis juillet 2021) | tous les 1 à 6 mois |
| `dvf.py` | Etalab · DVF géolocalisées (publication en avril et en octobre) | tous les 6 mois |

```bash
cd ~/primo-scripts
python3 -m unittest discover tests     # tests du parseur étage / porte
python3 dvf.py                         # recharge seulement les années nouvelles ou republiées
python3 dpe.py                         # n’importe que les DPE créés ou modifiés depuis le dernier passage
```

## Comportement

- **Table vide** → import complet automatique.
- **Table remplie** → import incrémental :
  - `dpe.py` interroge l’ADEME sur `date_derniere_modification_dpe` depuis le dernier passage : ajoute les nouveaux DPE et complète les existants (par `numero_dpe`), sans jamais effacer une valeur déjà connue.
  - `dvf.py` compare la date de publication (`Last-Modified`) de chaque année avec celle du dernier import et, pour les années absentes ou republiées, n’ajoute que les lignes qui ne sont pas déjà en base.
- **Aucune suppression** : les scripts n’effacent jamais de données. Un DPE remplacé ou retiré par l’ADEME reste en base ; une ligne DVF corrigée par Etalab est ajoutée à côté de l’ancienne.
- **Reprise** : `dpe.py` découpe l’import en partitions mensuelles ; relancé après une coupure, il reprend aux partitions restantes.
- **Suivi** : tout est tracé dans la table `data_import_state` (source, partition, version, nombre de lignes, date).
- Les lectures de l’application ne sont jamais bloquées : chaque partition ou année est traitée dans sa propre transaction.

## Options

| Option | Effet |
|---|---|
| `dpe.py --full` | réimporte tous les DPE depuis juillet 2021 |
| `dpe.py --workers 6` | parallélisme du téléchargement (4 par défaut) |
| `dpe.py --only date_etablissem-2021-07` | traite une seule partition (test) |
| `dvf.py --full` | recharge toutes les années publiées |
| `dvf.py --years 2024 2025` | limite à certaines années |

Variables d’environnement : `PRIMO_DB_CONTAINER`, `PRIMO_DB_USER`, `PRIMO_DB_NAME`.

## ⚠️ Schéma et TypeORM

Le backend tourne avec `synchronize: true`. Les scripts **ne créent jamais de colonne** : toute colonne ou tout index doit d’abord être déclaré dans l’entité (`back/src/database/`), sinon la synchronisation le supprime au redémarrage. Seule exception : `data_import_state`, table non gérée par TypeORM (donc conservée).
