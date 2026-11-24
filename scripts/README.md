# Scripts d’import de données ouvertes

À lancer **sur le VPS** (`ssh plotr`, dossier `/opt/primo/scripts`), idéalement dans un `tmux`. Envoi depuis le repo : `server/deploy.sh plotr`. Tout lancer d’un coup : `sudo /opt/primo/install/08-donnees.sh`. Python 3.10+ (bibliothèque standard uniquement) et accès au conteneur `postgis_primo` via `docker exec`.

| Script | Source | Mise à jour conseillée |
|---|---|---|
| `dpe.py` | ADEME · DPE logements existants (depuis juillet 2021) | tous les 1 à 6 mois |
| `dvf.py` | Etalab · DVF géolocalisées (publication en avril et en octobre) | tous les 6 mois |
| `rnic.py` | ANAH · registre national des copropriétés (trimestriel) | tous les 3 mois |
| `rpls.py` | SDES · logements sociaux au logement (RPLS, 1er janvier) | tous les ans |
| `loyers.py` | ANIL · carte des loyers par commune + encadrement Paris et Lyon | tous les ans (été) |
| `sitadel.py` | SDES · autorisations d’urbanisme Sitadel (PC, DP, PA, PD depuis 2013) → `autorisations_urbanisme` | tous les mois |

```bash
cd /opt/primo/scripts
python3 -m unittest discover tests     # tests du parseur étage / porte
python3 dvf.py                         # recharge seulement les années nouvelles ou republiées
python3 dpe.py                         # n’importe que les DPE créés ou modifiés depuis le dernier passage
python3 rnic.py && python3 rpls.py && python3 loyers.py
python3 sitadel.py                     # reconstruit la table si un nouveau millésime est publié
```

## Sources « instantané » (`rnic.py`, `rpls.py`, `loyers.py`)

Ces jeux sont republiés en entier à chaque millésime : chaque script remplace son contenu en deux temps.

1. **Brut** : si la version publiée a changé, téléchargement dans une table `src_*` (colonnes texte, non gérée par TypeORM).
2. **Publication** : si la table cible existe (entité déployée), `delete` + `insert` typé dans une seule transaction, puis suppression de la table `src_*`.

Si l’entité n’est pas encore déployée, le script s’arrête après l’étape 1 ; relancé après le déploiement, il publie sans retélécharger. Les cibles (`coproprietes`, `rpls_logements`, `encadrement_loyers`) ont une colonne `geom` : PostGIS doit être actif dans la base `primo` (TypeORM l’active au démarrage dès qu’une entité a une colonne géométrique).

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

Le backend tourne avec `synchronize: true`. Les scripts **ne créent jamais de colonne** : toute colonne ou tout index doit d’abord être déclaré dans l’entité (`back/src/database/`), sinon la synchronisation le supprime au redémarrage. Seules exceptions : `data_import_state` et les tables temporaires `src_*`, non gérées par TypeORM (donc conservées).
