# Application Android (TWA)

APK Android de Primo : une Trusted Web Activity générée par [Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap) qui affiche `https://app.primo-data.fr` en plein écran. Le contenu suit chaque déploiement du web : l'APK n'est à reconstruire que si le nom, l'icône, les couleurs ou le package changent.

## Prérequis (une fois)

- JDK 17 et SDK Android (`build-tools;36.1.0`), déclarés dans `~/.bubblewrap/config.json`.
- `android.keystore` dans ce dossier (non versionné, à sauvegarder hors du repo avec ses mots de passe).

## Reconstruire l'APK

```bash
cd twa
npx @bubblewrap/cli build
cp app-release-signed.apk ../landing-page/public/downloads/primo.apk
```

Incrémenter `appVersionCode` et `appVersion` dans `twa-manifest.json` avant chaque nouvelle version.

## Barre d'URL

`web/public/.well-known/assetlinks.json` doit contenir l'empreinte SHA-256 du keystore, sinon Chrome affiche une barre d'URL en haut de l'app :

```bash
keytool -printcert -jarfile app-release-signed.apk | grep SHA256
```
