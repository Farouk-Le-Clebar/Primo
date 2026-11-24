# Audit de l'ATP Primo (atp_543_Primo.xlsx)

Audit réalisé le 24/11/2026 en comparant chaque ligne de l'Acceptance Test Plan au code du monorepo
(branche `PRIM-235-EDIT-upgrade-visual-from-dashboard`). Les comptes de test `user@primo-data.fr` et
`admin@primo-data.fr` n'ont pas été vérifiés en production.

Toutes les lignes de l'ATP sont marquées « Done », sauf F32 (« In progress »). Plusieurs fonctionnalités
marquées « Done » ne sont pourtant pas présentes dans le code.

---

## 1. Fonctionnalités manquantes ou incomplètes (par ordre de simplicité)

### Très simple (moins d'une heure)

| # | ATP | Constat | Action |
|---|-----|---------|--------|
| 1 | F18 Météo | `widgets/meteo/MeteoWidget.tsx` existait mais n'était branché sur aucun onglet. | ✅ **Fait** : onglet Environnement > Météo, widget réécrit au format des autres onglets. |
| 2 | F29 Documents | L'ATP annonce 125 Mo par projet. Le code limitait à 20 Mo par fichier et 1 Go par utilisateur (`back/src/projects/projects.service.ts`). | ✅ **Fait** : quota de 125 Mo par projet (`GET /projects/:projectId/storage`), 20 Mo max par fichier conservé. |
| 3 | Lien APK | `https://app.primo-data.fr/apk` renvoie la page HTML de la SPA, pas un APK. | ✅ **Fait côté web** : application responsive (voir section 6). Reste à remplacer le lien APK de l'ATP par `https://app.primo-data.fr`. |

### Simple (quelques heures)

| # | ATP | Constat | Action |
|---|-----|---------|--------|
| 4 | F16 Transport | La catégorie POI « Transport » ne contient que `gare`. Bus, métro et tram absents. | Ajouter les arrêts de bus, stations de métro et de tram dans `widgets/pois/constants.ts` et la source de données correspondante. |
| 5 | F26 Gestion des feedbacks | L'admin peut lister, filtrer et supprimer, mais pas changer de statut. | Ajouter une colonne `status` (nouveau / en cours / résolu) et un endpoint `PATCH`. |
| 6 | F32 Comparaison IA | Back (OpenRouter + polling) et `ComparisonDialog` présents. `ComparisonHistory` supprimé. | Vérifier `OPENROUTER_API_KEY` et `OPENROUTER_MODEL` en prod, tester les états erreur et timeout, passer la ligne en « Done ». |

### Moyen (1 à 2 jours chacun)

| # | ATP | Constat | Action |
|---|-----|---------|--------|
| 7 | F31 Notifications « temps réel » | Polling toutes les 60 s (`web/src/hooks/useNotifications.ts`), pas de temps réel. Le menu a été réécrit (`components/navbar/components/newsPopup/`). | Passer en WebSocket/SSE, ou reformuler l'ATP (« rafraîchies chaque minute »). Retester invitation, acceptation et refus. |
| 8 | F19 Pollution | Absente. Géorisques ne couvre que les risques naturels et le radon. | ✅ **Fait** : onglet Environnement > Pollution (SIS, CASIAS, ICPE via l'API Géorisques ; qualité de l'air via Open-Meteo). |
| 9 | F20 Connexion 4G/5G/Wi-Fi | Aucune trace dans le code. | ✅ **Fait** : onglet Environnement > Connexion (antennes 4G/5G par opérateur via l'API ANFR ; fibre et débits de la commune via l'open data Arcep). |

### Lourd

| # | ATP | Constat | Action |
|---|-----|---------|--------|
| 10 | F30 Jalons de projet | Aucune occurrence de « milestone » ou « jalon ». | ✅ **Fait** : onglet projet « Jalons » (création, date prévue, validation, suppression, barre d'avancement, étapes types), notification « a validé un jalon » aux membres. Table `project_milestones`, routes `projects/:projectId/milestones`. |

---

## 2. Erreurs dans le document ATP

- **F1 / F2** : les résultats attendus de Register et Login sont inversés.
- **F11** : objectif et résultat attendu manquants.
- **F20** : prérequis « 1+ project created » (copier-coller) au lieu de « plot selected ».
- **F8** : l'IA renvoie une ville et ses coordonnées, pas des « plot suggestions ».
- **F13, F16, F18, F19, F20** : les noms d'onglets ne correspondent pas à l'interface. Chemins réels :
  Bâti > DPE, Environnement > Points d'intérêt, Environnement > Géorisques, Environnement > Pollution,
  Environnement > Météo, Environnement > Connexion. Il n'existe pas d'onglet « Energy », « Transport » ni « Environment ».
- **F5, F23** : la page « Dashboard > Project » n'existe plus. Les projets sont un panneau de la carte.
- **F29** : le quota annoncé doit correspondre au code (125 Mo par projet).
- **Info & Access** : le lien APK ne fonctionne pas.

---

## 3. Fonctionnalités présentes mais absentes de l'ATP

À ajouter comme nouvelles lignes de test :

- Fiche logement, Autorisations d'urbanisme (Sitadel).
- Habitat : copropriété (RNIC), logements sociaux (RPLS), loyers et rendement.
- Projets : notes, adresses, export des parcelles.
- Mot de passe oublié, onboarding, couleurs de carte personnalisées.
- Admin : statistiques, historique de connexions par utilisateur.
- Utilisation mobile de l'application web (responsive).
- Landing page : formulaires de contact.

---

## 4. Dette technique et risques

- **Branche non commitée** : environ 150 fichiers modifiés, dont des suppressions. Commiter et merger avant toute démo.
- **Tests** : seulement 2 fichiers `.spec` (map-colors) et l'e2e par défaut. Priorité : F1 à F4 (inscription, connexion, Google, vérification email).
- **Règles du `CLAUDE.md` non respectées** : 109 `any`, 32 fichiers de plus de 150 lignes, commentaires dans `back/src/comparisons/comparisons.service.ts` et `plot-enrichment.service.ts`.
- **`synchronize: true` en production** : renommer ou retyper une colonne d'entité efface ses données.

---

## 5. Ordre de travail conseillé

1. Commiter et merger la branche en cours.
2. Corriger le document ATP (section 2) et y ajouter les fonctionnalités de la section 3.
3. Traiter les points 1 à 6.
4. Traiter les points 7 à 9.
5. Implémenter les jalons (point 10).

---

## 6. Version mobile (responsive)

Testée à 390 × 844 px (taille iPhone) :

- **Navigation** : barre d'onglets en bas (Carte, Projets, Rechercher, Admin) sous 768 px ; barre du haut réduite au logo et aux actions.
- **Carte** : recherche et contrôles alignés sans chevauchement ; carte parcelle compacte au-dessus de la barre d'onglets.
- **Projets** : liste des projets en plein écran, puis espace projet avec bouton retour ; onglets du projet défilants ; tableaux défilants horizontalement.
- **Fiche parcelle** : tous les onglets lisibles en une colonne.
- **Admin** : sections en onglets horizontaux au-dessus du contenu.
- **Notifications, profil, retours** : popups et barres flottantes adaptés à la largeur et placés au-dessus de la barre d'onglets.
- `viewport-fit=cover` et marges `safe-area` pour les iPhone à encoche.

---

## 7. Sources externes ajoutées (sans import sur le VPS)

Module back `back/src/environnement/`, routes `POST /environnement/pollution` et `POST /environnement/connectivite` (JWT).
Chaque source est indépendante : si l'une tombe, les autres s'affichent quand même.

| Donnée | Source | Clé API | Échelle |
|---|---|---|---|
| Secteurs d'information sur les sols, sites suivis, anciens sites industriels (CASIAS) | API Géorisques v1 `/ssp` | non | 500 m autour de la parcelle |
| Installations classées (ICPE) | API Géorisques v1 `/installations_classees` | non | 1 km |
| Qualité de l'air (indice européen, PM2,5, PM10, NO₂, O₃) | Open-Meteo Air Quality (Copernicus) | non | point, horaire |
| Antennes 4G/5G actives par opérateur | API ANFR `observatoire_2g_3g_4g` | non | 1 km et 5 km |
| Éligibilité fibre, câble, cuivre, 4G fixe, débits | CSV Arcep « Ma connexion internet » par commune, mis en cache 24 h | non | commune |

Le serveur de production doit pouvoir joindre `georisques.gouv.fr`, `air-quality-api.open-meteo.com`, `data.anfr.fr` et `data.arcep.fr`.

---

## 8. Audit final de l'ATP (après corrections)

### Manques critiques (un testeur échoue)

1. ~~**F30 Jalons de projet**~~ : ✅ fait (Projet > Jalons).
2. **Déploiement** : toutes les corrections sont locales et non commitées. Les testeurs utilisent `app.primo-data.fr` : il faut merger et déployer.
3. **Lien APK** (onglet Info & Access) : cassé. Le remplacer par `https://app.primo-data.fr` (utilisable sur mobile).

### À vérifier avant la recette

4. **F32 Comparaison IA** : marquée « In progress ». Vérifier `OPENROUTER_API_KEY` et `OPENROUTER_MODEL` en production, puis passer en « Done ».
5. **Comptes de test** : `user@primo-data.fr` existe sur la base utilisée en local, mais la connexion avec le mot de passe de l'ATP a échoué (« Email ou mot de passe incorrect »). Vérifier les deux comptes et leur mot de passe en production.
6. **Adresses de démo** : indiquer dans les prérequis de F12 à F17 une adresse où DVF, DPE et bâtiments sont remplis, pour éviter les écrans vides.

### Petits détails (formulation de l'ATP)

- F1 / F2 : résultats attendus inversés. F11 : objectif et résultat attendu vides.
- F8 : l'IA propose une ville et ses coordonnées, pas des parcelles.
- F10 : le clic affiche la référence et l'adresse ; le détail s'ouvre avec « Analyse complète ».
- F16 : seules les gares sont listées en transport (pas de bus ni de métro).
- F18 : normales climatiques (températures, précipitations), pas de météo du jour ni d'ensoleillement.
- F20 : la Wi-Fi n'est pas mesurable en open data ; l'onglet montre l'éligibilité internet fixe (qui fournit la Wi-Fi) et la 4G/5G.
- F26 : la gestion des retours se limite à filtrer et supprimer (pas de statut).
- F27 : la promotion se fait depuis Administration > Administrateurs, par e-mail.
- F31 : notifications rafraîchies toutes les 60 s et au retour sur l'onglet, pas en temps réel strict.
- F5, F23 : les projets sont un panneau de la carte, plus une page « Dashboard ».
- Chemins d'onglets à corriger (voir section 2).
