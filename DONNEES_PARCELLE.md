# Catalogue des données par parcelle

Inventaire de toutes les données ouvertes utilisables dans la fiche parcelle de Primo : ce qui est déjà intégré, ce qui peut l’être, d’où ça vient et où on le stocke. Relevé du 26 octobre 2026.

À utiliser comme feuille de route : on valide les lignes une par une (colonne **Décision**), puis on les intègre par ordre de priorité.

---

## 0. Règle d’or : tout est stocké chez nous

Aucune donnée affichée à l’utilisateur ne doit dépendre, au moment de l’affichage, d’un service tiers.

1. **Ingestion** : la donnée est récupérée par un script de `scripts/` (téléchargement complet de préférence, API seulement si aucun fichier n’existe, même lente).
2. **Stockage** :
   - base **`primo`** (PostgreSQL) pour les données interrogées par parcelle, adresse, commune ou bâtiment, via une entité TypeORM ;
   - base **`bdtopo`** + **GeoServer** pour les couches à afficher sur la carte ou à croiser géographiquement en masse.
3. **Suivi** : chaque import est tracé dans `data_import_state` (version, date, nombre de lignes) et relançable sans risque.
4. **Lecture** : l’application lit uniquement nos bases. Une API tierce qui ferme du jour au lendemain ne bloque que la *mise à jour*, jamais l’affichage.

Statuts : ✅ intégré · 🟡 intégré mais à corriger · ⬜ à faire · 🔒 non accessible en open data.
Priorité : **P1** forte valeur et facile · **P2** forte valeur, plus de travail · **P3** complément.

---

## 1. Dépendances externes à supprimer dans l’existant

| Usage actuel | Problème | Action proposée | Décision |
|---|---|---|---|
| Zonage PLU, prescriptions, informations (`web/src/requests/geoserver/*.ts`) | Interroge **d’abord** le WFS national IGN `data.geopf.fr`, et notre GeoServer seulement en secours | Inverser : GeoServer local uniquement, actualisé par un script d’import GPU | ☐ |
| Liens « règlement du PLU » vers `geoportail-urbanisme.gouv.fr` | Le PDF n’est pas chez nous | Non retenu : documents lourds et secondaires, on garde le simple lien vers le Géoportail | ✗ Non retenu |
| Fonds de carte satellite MapTiler et Google | Clé tierce, et tuiles Google sans licence d’usage | Orthophotos IGN (BD ORTHO, Licence Ouverte) servies par notre GeoServer ou en tuiles pré-générées (volumineux : à prévoir avec le NAS) | ☐ |

---

## 2. Déjà intégré

| Donnée | Source | Stockage | Statut | Remarque |
|---|---|---|---|---|
| Parcelles et sections cadastrales | Etalab, cadastre (2025-09) | `bdtopo.parcelles_<dép>`, `sections_<dép>` + GeoServer | ✅ | Millésime à rafraîchir chaque semestre |
| Bâtiments (emprise, hauteur, étages, logements, matériaux, RNB) | IGN BD TOPO 3.5 (2025-09) | `bdtopo.batiment_<dép>` + GeoServer | 🟡 | Étages et logements remplis à 44 %, matériaux à 35 % : compléter avec la BDNB (§3) |
| PLU : zonage, prescriptions, informations | Géoportail de l’urbanisme | `bdtopo.gpu_<dép>_*` + GeoServer | 🟡 | Voir §1 : l’application appelle encore l’API nationale |
| Ventes immobilières | DVF géolocalisées (Etalab) | `primo.dvf_mutations` | ✅ | `scripts/dvf.py`, semestriel |
| DPE logements existants (depuis 07/2021) | ADEME | `primo.dpe` | ✅ | `scripts/dpe.py` |
| Risques communaux, arrêtés CatNat, radon, sismicité | Géorisques | `bdtopo.georisques.*`, `primo.georisques_communes` | ✅ | Échelle communale seulement : voir §5 pour l’échelle parcelle |
| Autorisations d’urbanisme | SDES Sitadel | `primo.autorisations_urbanisme` | ✅ | Pas de géométrie, rapprochement par référence cadastrale |
| Copropriétés | ANAH, registre RNIC (quotidien) | `primo.coproprietes` | ✅ | `scripts/rnic.py` |
| Logements sociaux | SDES RPLS | `primo.rpls_logements` | ✅ | `scripts/rpls.py`, annuel |
| Loyers de marché par commune | ANIL, carte des loyers | `primo.loyers_communes` | ✅ | `scripts/loyers.py` |
| Encadrement des loyers | Paris, Métropole de Lyon | `primo.encadrement_loyers` | ✅ | Lille : open data plus publié |
| Points d’intérêt, équipements | OpenStreetMap (Geofabrik) | `bdtopo.pois_france`, `infrastructures` | ✅ | |
| Climat | WorldClim | `bdtopo.meteo_dept_<dép>` | ✅ | |
| Géocodage d’adresses | BAN (Addok) | `addok-data` | ✅ | |

---

## 3. Bâtiment

| Donnée affichable | Utilité | Source | Échelle | Format · volume | MàJ | Stockage prévu | Prio | Décision |
|---|---|---|---|---|---|---|---|---|
| **Année de construction réelle**, nombre de logements, nombre de niveaux, surface habitable | Corrige la page Bâtiments (surface de plancher, ancienneté) | [BDNB](https://www.data.gouv.fr/datasets/base-de-donnees-nationale-des-batiments/) (CSTB, Licence Ouverte) | bâtiment, rattaché aux parcelles et au RNB | export pgdump ou CSV France : 40 Go | 3 fois par an | `primo.bdnb_*` (sélection de colonnes) | **P1** | ☐ |
| **Énergie du bâtiment** : DPE représentatif, répartition A-G de tous les DPE, chauffage (énergie, individuel ou collectif, générateur et âge), isolation murs, planchers et toit, vitrage, ventilation | Travaux probables, Loi Climat à l’échelle de l’immeuble | BDNB | bâtiment | idem | idem | idem | **P1** | ☐ |
| **Propriétaires personnes morales** du bâtiment (bailleurs, SCI, SCPI, collectivités) | Qui possède l’immeuble | BDNB (issu de la DGFiP) | bâtiment | idem | annuelle | idem | **P1** | ☐ |
| Aléa retrait-gonflement des argiles du bâtiment | Risque de fissures, assurance | BDNB | bâtiment | idem | idem | idem | **P1** | ☐ |
| Monument historique le plus proche, distance, périmètre ABF, bâti patrimonial au PLU | Travaux soumis à l’avis de l’architecte des Bâtiments de France ; dispositifs Malraux et MH | BDNB | bâtiment | idem | idem | idem | **P1** | ☐ |
| Réseau de chaleur proche et identifiant | Alternative de chauffage, DPE | BDNB + [tracés France Chaleur Urbaine](https://www.data.gouv.fr/datasets/64f05d3568e4d575eb454ffe) | bâtiment, tracé | GeoJSON national | continue | `bdtopo.reseaux_chaleur` + GeoServer | P2 | ☐ |
| Potentiel solaire thermique, géothermie (nappe, sonde) | Rénovation, autoconsommation | BDNB | bâtiment | idem | idem | `primo.bdnb_*` | P2 | ☐ |
| Logement traversant, balcons, orientation et part de surface vitrée | Arguments locatifs | BDNB (issu des DPE) | bâtiment | idem | idem | idem | P2 | ☐ |
| Consommations réelles d’électricité et de gaz | Contrôle de cohérence du DPE | BDNB (données locales de l’énergie) | bâtiment | idem | idem | idem | P3 | ☐ |
| Identifiant unique de bâtiment et ses liens (BAN, parcelles, BD TOPO) | Clé de jointure fiable entre toutes les sources | [Référentiel National des Bâtiments](https://www.data.gouv.fr/datasets/referentiel-national-des-batiments/) | bâtiment | export par département (zip) | hebdomadaire | `primo.rnb_batiments` | **P1** | ☐ |
| DPE logements neufs et DPE avant juillet 2021 | Historique complet, logements récents | ADEME (`dpe-france`, `g3cgx7jb3cmys5voxz1mrm22`) | logement | API ADEME en masse | continue | `primo.dpe` (même table, colonne source) | P2 | ☐ |
| DPE tertiaire (bureaux, commerces) | Locaux professionnels | [ADEME DPE tertiaire](https://www.data.gouv.fr/datasets/dpe-tertiaire-depuis-juillet-2021/) | local | API ADEME en masse | continue | `primo.dpe_tertiaire` | P2 | ☐ |
| Audits énergétiques réglementaires | Travaux préconisés lors d’une vente de passoire | ADEME (`ync2epx48x9azbdnggbygqp0`) | logement | API ADEME en masse | continue | `primo.audits_energetiques` | P2 | ☐ |
| Éligibilité à la fibre de chaque immeuble | Critère locatif | [Arcep, Ma connexion internet](https://www.data.gouv.fr/datasets/5e836644ca07c8558d91a6fc) | immeuble ou adresse | CSV trimestriels (data.arcep.fr) | trimestrielle | `primo.fibre_immeubles` | P2 | ☐ |
| Forme précise des toits, hauteur au décimètre | 3D, potentiel solaire fin | IGN LiDAR HD | nuage de points | plusieurs To | en cours | NAS + table dérivée par bâtiment | P3 | ☐ (attente NAS) |
| Fichiers fonciers (surface de chaque local, propriétaires particuliers) | — | DGFiP / Cerema | local | — | — | — | 🔒 | Réservé aux ayants droit ; la BDNB en publie des agrégats |

---

## 4. Propriété, fiscalité, dispositifs

| Donnée affichable | Utilité | Source | Échelle | Format · volume | MàJ | Stockage prévu | Prio | Décision |
|---|---|---|---|---|---|---|---|---|
| Propriétaires personnes morales de la parcelle (raison sociale, SIREN, forme juridique) | Qui détient le foncier | [DGFiP, locaux et parcelles des personnes morales](https://www.data.gouv.fr/datasets/fichiers-des-locaux-et-des-parcelles-des-personnes-morales-version-unifiee/) | parcelle | Parquet, 370 Mo par an | annuelle | `primo.parcelles_personnes_morales` | **P1** | ☐ |
| Taux de taxe foncière, TEOM, taxe d’habitation sur les résidences secondaires | Coût de détention pour un investisseur | [DGFiP, REI](https://www.data.gouv.fr/datasets/impots-locaux-fichier-de-recensement-des-elements-dimposition-a-la-fiscalite-directe-locale-rei-4/) | commune | zip annuels | annuelle | `primo.fiscalite_communes` | **P1** | ☐ |
| Zonage A bis, A, B1, B2, C | Éligibilité aux dispositifs (PTZ, LLI, Denormandie…) et plafonds de loyers | [Zonages logement ABC](https://www.data.gouv.fr/datasets/zonages-logement-abc-et-zonages-i-ii-iii-1/) | commune | CSV | à chaque arrêté | `primo.zonage_logement` | **P1** | ☐ |
| Zone tendue (taxe sur les logements vacants, préavis d’un mois) | Règles de location | [Zones tendues](https://www.data.gouv.fr/datasets/simulateur-des-zones-tendues/) | commune | CSV | à chaque décret | `primo.zonage_logement` | **P1** | ☐ |
| Programmes Action cœur de ville, Petites villes de demain, ORT | Éligibilité Denormandie, aides | [ACV](https://www.data.gouv.fr/datasets/listes-des-villes-action-coeur-de-ville/), [PVD](https://www.data.gouv.fr/datasets/programme-petites-villes-de-demain/), ORT (jeux départementaux et ANCT) | commune, périmètre | CSV, SIG | annuelle | `primo.programmes_territoriaux` | P2 | ☐ |
| Quartiers prioritaires (QPV 2024) | Mixité, TVA réduite dans le neuf | [QPV 2024](https://www.data.gouv.fr/datasets/quartiers-prioritaires-de-la-politique-de-la-ville-au-1er-janvier-2024/) | périmètre | SIG | rare | `bdtopo.qpv` + GeoServer | P2 | ☐ |
| Logements vacants du parc privé | Tension du marché, risque de vacance | [LOVAC par commune](https://www.data.gouv.fr/datasets/logements-vacants-du-parc-prive-par-commune-departement-region-france-de-2020-a-2026/) | commune | CSV | annuelle | `primo.vacance_communes` | P2 | ☐ |
| Commercialisation des logements neufs (prix, stocks) | Concurrence du neuf | [SDES, zonage ABC](https://www.data.gouv.fr/datasets/donnees-selon-le-zonage-abc-sur-la-commercialisation-des-logements-neufs/) | zone | CSV | trimestrielle | `primo.marche_neuf` | P3 | ☐ |

---

## 5. Risques et contraintes à l’échelle de la parcelle

| Donnée affichable | Utilité | Source | Échelle | Format · volume | MàJ | Stockage prévu | Prio | Décision |
|---|---|---|---|---|---|---|---|---|
| Retrait-gonflement des argiles (nouvelle carte en vigueur au 1er juillet 2026) | Fissures, étude de sol obligatoire avant de construire | Géorisques / BRGM ; [exposition des maisons](https://www.data.gouv.fr/datasets/exposition-des-maisons-individuelles-au-phenomene-de-retrait-gonflement-des-argiles-rga/) | zone | SIG national | rare | `bdtopo.argiles` + GeoServer | **P1** | ☐ |
| Zonages réglementaires des PPR (inondation, mouvement de terrain, technologique) | Constructibilité, assurance, obligation d’information acquéreur | Géoportail de l’urbanisme (servitudes PM1, PM3) et Géorisques | zone | SIG par département | continue | `bdtopo.sup_<type>` + GeoServer | **P1** | ☐ |
| Zones inondables (EAIP, TRI, AZI), remontées de nappes | Inondation hors PPR | Géorisques | zone | SIG national | rare | `bdtopo.inondation_*` | P2 | ☐ |
| Sites et sols pollués : SIS, CASIAS (anciens sites industriels) | Dépollution, obligation d’information | Géorisques ; [CASIAS](https://www.data.gouv.fr/datasets/carte-des-anciens-sites-industriels-et-activites-de-services-casias/) | site | SIG national | annuelle | `bdtopo.sols_pollues` | **P1** | ☐ |
| Installations classées (ICPE) à proximité | Nuisances, risque industriel | Géorisques (base nationale ICPE) | point | CSV, SIG | continue | `bdtopo.icpe` | P2 | ☐ |
| Cavités souterraines, mouvements de terrain recensés | Risque d’effondrement | Géorisques / BRGM | point, zone | SIG national | rare | `bdtopo.cavites`, `mvt_terrain` | P2 | ☐ |
| Canalisations de matières dangereuses (gaz, hydrocarbures) | Servitude, risque | Géorisques ; servitudes I1, I3 du GPU | tracé | SIG | rare | `bdtopo.canalisations` | P2 | ☐ |
| Toutes les servitudes d’utilité publique (abords des MH AC1, sites AC2, SPR AC4, alignement EL7, lignes électriques I4, aérodromes T5…) | Contraintes juridiques réelles de la parcelle | Géoportail de l’urbanisme (catégories SUP) | zone | WFS ou export par catégorie | continue | `bdtopo.sup_*` + GeoServer | **P1** | ☐ |
| Monuments historiques (immeubles protégés) | Patrimoine, avis ABF | Ministère de la Culture (base Mérimée / POP) et [périmètres AC1](https://www.data.gouv.fr/datasets/perimetre-de-protection-des-monuments-historiques) | point, zone | CSV, SIG | continue | `bdtopo.monuments_historiques` | P2 | ☐ |
| Bruit : cartes de bruit stratégiques, plans d’exposition au bruit des aérodromes | Nuisances, constructibilité (PEB) | DDT par département ([exemple CBS](https://www.data.gouv.fr/datasets/zones-de-bruit-des-cartes-de-bruit-strategiques-4eme-echeance-1/)) ; PEB sur le Géoportail | zone | SIG départementaux (pas de jeu national unique) | 5 ans | `bdtopo.bruit_*` | P2 | ☐ |
| Recul du trait de côte | Constructibilité littorale | [Cerema](https://www.data.gouv.fr/datasets/recul-evenementiel-du-trait-de-cote-1/) et zonages communaux | zone | SIG | rare | `bdtopo.trait_de_cote` | P3 | ☐ |
| Obligations légales de débroussaillement | Obligation du propriétaire, amendes | DDT par département | zone | SIG départementaux | rare | `bdtopo.old` | P3 | ☐ |
| Natura 2000, ZNIEFF, zones humides | Contraintes environnementales | INPN (MNHN) | zone | SIG national | annuelle | `bdtopo.protections_env` | P3 | ☐ |

---

## 6. Cadre de vie et environnement

| Donnée affichable | Utilité | Source | Échelle | Format · volume | MàJ | Stockage prévu | Prio | Décision |
|---|---|---|---|---|---|---|---|---|
| Revenus médians, taux de pauvreté, part de propriétaires (carreaux de 200 m) | Profil social du quartier, très fin | [INSEE Filosofi carroyé 2021](https://www.data.gouv.fr/datasets/revenus-pauvrete-et-niveau-de-vie-donnees-carroyees-2019-et-2021-dispositif-fichier-localise-social-et-fiscal-filosofi/) | carreau 200 m | Parquet, 95 Mo | 2-3 ans | `bdtopo.filosofi_200m` | **P1** | ☐ |
| Population, âge, ménages, propriétaires et locataires, vacance | Demande locative | INSEE, bases infracommunales du recensement (IRIS) | IRIS | CSV | annuelle | `primo.insee_iris` | P2 | ☐ |
| Équipements officiels (écoles, santé, commerces, services) | Complète et fiabilise OSM | INSEE BPE nationale | point | CSV géolocalisé | annuelle | `bdtopo.bpe` | P2 | ☐ |
| Écoles et collèges : secteur, effectifs, indice de position sociale | Critère familles | [Annuaire de l’éducation](https://www.data.gouv.fr/datasets/annuaire-de-leducation/), [IPS](https://www.data.gouv.fr/datasets/indices-de-position-sociale-dans-les-ecoles-a-partir-de-2022/) | établissement | CSV | annuelle | `primo.etablissements_scolaires` | P2 | ☐ |
| Transports en commun : arrêts et fréquence de passage | Accessibilité réelle | transport.data.gouv.fr (GTFS de tous les réseaux) | arrêt | GTFS (lourd) | hebdomadaire | `bdtopo.arrets_tc` (fréquences pré-calculées) | P2 | ☐ |
| Bornes de recharge électrique | Usage, valeur du bien | IRVE consolidée (transport.data.gouv.fr) | point | CSV | quotidienne | `bdtopo.irve` | P3 | ☐ |
| Délinquance enregistrée | Sécurité | [SSMSI, bases communales](https://www.data.gouv.fr/datasets/bases-statistiques-communale-departementale-et-regionale-de-la-delinquance-enregistree-par-la-police-et-la-gendarmerie-nationales/) | commune | CSV | annuelle | `primo.delinquance_communes` | P2 | ☐ |
| Îlots de chaleur (zones climatiques locales) | Confort d’été, adaptation au climat | [Cerema LCZ, 93 territoires](https://www.data.gouv.fr/datasets/cartographie-des-zones-climatiques-locales-lcz-des-93-territoires-de-plus-de-50-000-habitants-en-france/) | îlot | SIG | rare | `bdtopo.lcz` | P2 | ☐ |
| Qualité de l’eau du robinet | Santé | [Ministère de la Santé, contrôle sanitaire](https://www.data.gouv.fr/datasets/resultats-du-controle-sanitaire-de-leau-distribuee-commune-par-commune/) | commune | CSV | mensuelle | `primo.eau_potable` | P3 | ☐ |
| Couverture mobile, antennes relais | Connectivité | Arcep (Mon réseau mobile), ANFR | zone, point | SIG, CSV | trimestrielle | `bdtopo.mobile`, `antennes` | P3 | ☐ |
| Établissements actifs à proximité (commerces au pied de l’immeuble) | Animation, emplacement commercial | INSEE SIRENE (stock géolocalisé) | établissement | Parquet, plusieurs Go | mensuelle | `bdtopo.sirene` | P3 | ☐ |
| Projections climatiques (chaleur, sécheresse, à horizon 2050) | Risque climatique à long terme | DRIAS (Météo-France) | maille 8 km | NetCDF / CSV | rare | `bdtopo.drias` | P3 | ☐ |

---

## 7. Marché et loyers (compléments)

| Donnée affichable | Utilité | Source | Échelle | Format · volume | MàJ | Stockage prévu | Prio | Décision |
|---|---|---|---|---|---|---|---|---|
| Loyers observés par quartier, ancienneté du locataire, typologie | Plus fin et plus fiable que les loyers d’annonce | [Observatoires locaux des loyers](https://www.data.gouv.fr/datasets/resultats-des-observatoires-locaux-des-loyers-par-agglomeration/) | zone d’observation | CSV | annuelle | `primo.loyers_observatoires` | **P1** | ☐ |
| Prix au m² relatif à la commune pour chaque bâtiment | Sur- ou sous-cote | BDNB | bâtiment | voir §3 | idem | `primo.bdnb_*` | P2 | ☐ |
| Historique des carnets de prix DVF agrégés (commune, IRIS) | Tendance de marché | Calcul à partir de `dvf_mutations` | commune, IRIS | — | semestrielle | vue matérialisée `primo.dvf_indices` | P2 | ☐ |

---

## 8. Ordre de travail proposé

1. **Supprimer les dépendances du §1** (PLU en local, règlements archivés).
2. **BDNB + RNB** : un import, et la page Bâtiments gagne l’année réelle, l’énergie, les propriétaires et les contraintes.
3. **Propriétaires personnes morales, fiscalité locale, zonages ABC et zones tendues** : petits fichiers, fort impact investisseur.
4. **Risques à la parcelle** (argiles, PPR et servitudes, sols pollués).
5. **Filosofi 200 m et observatoires locaux des loyers.**
6. Le reste par priorité.

Chaque ligne validée devient : un script dans `scripts/`, une entité ou une couche GeoServer, un endpoint, et un bloc dans la fiche parcelle.
