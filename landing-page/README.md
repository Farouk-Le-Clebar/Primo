# Primo — Landing page

Landing page française en Astro 5 et Tailwind CSS 4, réalisée à partir du projet fourni.

## Démarrer

```sh
npm ci
npm run dev
```

Pour produire les fichiers statiques : `npm run build`. Pour les consulter : `npm run preview`.

## Fichiers principaux

- `src/pages/index.astro` : page, navigation mobile, changement de thème et apparitions au défilement.
- `src/styles/landing.css` : identité visuelle, responsive et thèmes.
- `src/config/constants.ts` : liens existants vers l’application, le formulaire bêta et les réseaux sociaux.
- `public/images/primo-map.webp` et `primo-welcome.webp` : captures fournies, optimisées en WebP.

Les autres pages du projet (blog, présentation et pages légales) sont conservées. Le nouveau thème concerne la landing page. La police géométrique UberMove fournie avec le projet est hébergée localement.

Les CTA « Commencer un projet » et « Se connecter » ouvrent l’URL de l’application déjà configurée. Aucun système d’authentification n’est ajouté à la landing page. Les mini-cartes sont des illustrations statiques identifiées comme exemples. Les tarifs restent à renseigner : aucun prix ni témoignage n’est inventé.

Thème initial : préférence enregistrée, puis préférence du système. Boutons principaux : noir pur / texte blanc en clair, blanc pur / texte noir en sombre. Animations : IntersectionObserver et CSS, désactivées avec prefers-reduced-motion. Le contenu reste visible sans JavaScript.

Le ZIP initial contenait deux lockfiles. Le projet livré utilise `package-lock.json` et npm pour une installation cohérente. Les dépendances et les fichiers générés ne sont pas inclus dans l’archive.

## SEO et animation d’arrivée

- Métadonnées mutualisées dans `src/components/seo/Seo.astro` : title, description, canonical, Open Graph, Twitter et JSON-LD Organization / WebSite / WebPage ; SoftwareApplication sur l’accueil, sans prix ni avis inventés.
- FAQ visible et lien vers les guides existants ; vocabulaire cadastral explicite dans le hero.
- Ancien composant `home/Home.astro` renommé `_Home.astro` pour ne plus générer de page publique accidentelle. Nginx redirige son ancienne URL vers `/`.
- Vraie page 404, exclue du sitemap et non indexable. Nginx retourne un statut 404 pour les URL inconnues ; fini le fallback vers l’accueil.
- URLs canoniques et sitemap avec slash final. robots.txt référence le sitemap principal.
- Animation CSS unique d’environ deux secondes : montée douce du titre et de la carte, tracé du soulignement, balayage menthe de la carte et arrivée séquencée des critères. Aucun moteur d’animation ajouté. Le titre et la carte ne sont pas masqués en attendant JavaScript ; aucun déplacement de mise en page par l’animation. Le mode reduced-motion supprime les mouvements.

### Après mise en production

1. Confirmer que `https://primo-data.fr` est le domaine canonique voulu ; rediriger les variantes HTTP/www vers lui au niveau de l’hébergeur.
2. Déployer `dist` et appliquer la configuration Nginx si vous utilisez le Docker fourni. Sur un autre hébergeur, configurer les vraies réponses 404 et les redirections équivalentes.
3. Vérifier la propriété du domaine dans Google Search Console, soumettre `https://primo-data.fr/sitemap-index.xml` et inspecter l’URL d’accueil. Aucun accès Search Console n’a été utilisé ici.
4. Mesurer sur le domaine réel les Core Web Vitals / PageSpeed mobile et tester les données structurées. La compilation locale ne constitue pas un score Lighthouse ni une validation Google.
5. Maintenir les guides du blog à jour et vérifier leurs chiffres, dates, sources et auteurs avant publication. Le contenu historique n’a pas fait l’objet d’un audit éditorial complet.

Ces changements améliorent les fondations techniques et sémantiques ; ils ne garantissent ni indexation ni classement.

Références :
- https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- https://developers.google.com/search/docs/appearance/structured-data
- https://www.service-public.gouv.fr/particuliers/vosdroits/F1633

## Vidéo et équipe

La vidéo fournie remplace la capture principale : `public/videos/primo-presentation.mp4` (H.264, sans audio, faststart). Le logo Gemini en bas à droite est effacé par interpolation locale, sans recadrage. Image d’attente : `public/images/primo-video-poster.jpg`. Lecture automatique muette tentée une seule fois, commandes natives, pas de boucle ; pas de démarrage automatique avec prefers-reduced-motion. Les profils de Jacques Sapin, Felix Schrynemaekers, Louis Huguet et Antonin Campi utilisent les liens fournis, avec initiales et sans fonction supposée.

Validation de cette version : compilation Astro réussie, images extraites à 2 et 9 secondes inspectées. Pas de test navigateur effectué.
