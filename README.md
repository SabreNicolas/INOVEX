# Prérequis

Afin d'utiliser l'application il faut installer :
- `Node.js` : https://nodejs.org/en/download/
- `npm` : `npm install -g npm@latest`
- `angular/cli` : `npm install -g @angular/cli`

# Développement local

Pour développer le projet lcoalement, suivez ces étapes : 

1. Clonez le répertoire à l'aide de `git clone`
2. Installez les dépendances : `npm install`
3. Exécutez la commande : `npm run start:local`. Vous serez connecté à l'api de développement.
4. Si vous souhaitez utiliser l'api locale que vous développez, changez le lien de l'api dans `src/environments/environment.local.ts`

# Démarrer la pré-prod sur le serveur

Pour lancer le projet directement sur le serveur en pré-prod :

1. Ouvrez le projet dans vs-code.
2. Lancez l'application via un terminal : `npm start`
3. Vérifiez le fonctionnement de la pré-prod ici : https://fr-couvinove300.prod.paprec.fr:8100/

# ATTENTION

- Avant chaque push sur le répertoire en ligne, veuillez réaliser les deux commande suivantes afin de formatter le code :
   - `npm run format:fix`
   - `npm run lint:fix`

- Si des erreurs consoles sont présentent lors du lancement de l'application, cela est du au fait que nous avons modifié une librairie. Veuillez suivre les étapes suivantes :
   1. Ouvrez le fichier `INOVEX\INOVEX\node_modules\calendar-utils\calendar-utils.d.ts`
   2. Modifiez l'interface *CalandarEvents* :
   ```typescript
      export interface CalendarEvent<MetaType = any> {
         id?: string | number;
         start: Date;
         end?: Date;
         title: string;
         color?: EventColor;
         actions?: EventAction[];
         allDay?: boolean;
         cssClass?: string;
         resizable?: {
            beforeStart?: boolean;
            afterEnd?: boolean;
         };
         draggable?: boolean;
         meta?: MetaType;
         ronde?: any[];
         isAction?: boolean;
         dateFinReccurrence?: string;
      }
   ```


# Création du site sur IIS avec Proxy et Réécriture d'URL en Reverse Proxy

## Étape 1 : Installer IIS sur votre machine

1. **Ouvrir le gestionnaire de serveur** :
   - Lancez le *Gestionnaire de serveur* (Server Manager) sur votre machine Windows.
   
2. **Ajouter le rôle IIS** :
   - Cliquez sur "Ajouter des rôles et fonctionnalités".
   - Sélectionnez le rôle *Services Web (IIS)* et validez.
   - Vous pouvez également ajouter des fonctionnalités comme *Réécriture d'URL* et *Proxy HTTP* si elles ne sont pas installées par défaut.

3. **Vérification de l'installation** :
   - Une fois IIS installé, ouvrez le navigateur et tapez `http://localhost`. Si IIS est correctement installé, vous verrez la page par défaut d'IIS.

## Étape 2 : Build et ajout du code sur le serveur web

1. **Build l'application Angular**
    - Allez dans un terminal, dans le dossier de l'application entrez la commande : ````npm run build````

2. **Ajout du code dans le serveur**
    - Une fois le build terminé, copiez le contenu du dossier ````/dist/INOVEX```` 
    - Collez le dans le serveur web, ici :  ````C:\inetpub\wwwroot\capexploitation```` (créez le sous répertoire de base si il n'est pas créé)

3. **Création du fichier web.config**
   - Créez le fichier ````web.config```` dans le répertoire web de l'application, ici : ````C:\inetpub\wwwroot\capexploitation```` avec le contenu suivant :
```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <system.webServer>
        <httpErrors existingResponse="Replace" errorMode="Custom">
            <remove statusCode="404" subStatusCode="-1" />
            <error statusCode="404" prefixLanguageFilePath="" path="/capexploitation/index.html" responseMode="ExecuteURL" />
        </httpErrors>
        <directoryBrowse enabled="true" />
    </system.webServer>
    <system.web>
        <sessionState mode="Off" />
        <httpRuntime requestValidationMode="2.0" requestPathInvalidCharacters="%,&amp;,\,?,*" />
        <pages validateRequest="false" />
    </system.web>
</configuration>
```
## Étape 3 : Créer un nouveau site Web sur IIS

1. **Ouvrir IIS Manager** :
   - Allez dans *Panneau de configuration* > *Outils d'administration* > *Gestionnaire des services Internet (IIS)*.

2. **Ajouter un site Web** :
   - Dans le *Gestionnaire IIS*, faites un clic droit sur *Sites* puis cliquez sur *Ajouter un site*.
   - Remplissez les informations nécessaires :
     - *Nom du site* : Choisissez un nom pour votre site (ici `CAP Exploitation`).
     - *Chemin du dossier physique* : Sélectionnez le répertoire où se trouvent vos fichiers du site. (Ici ```C:\inetpub\wwwroot```)
     - *Nom d'hôte* : Si vous utilisez un nom de domaine, entrez-le ici (dans notre cas : `fr-couvinove300.prod.paprec.fr`).
     - *Port* : Par défaut, le port 80 est utilisé pour HTTP. Si nécessaire, configurez un autre port.

3. **Valider la création** :
   - Une fois le site ajouté, vous devriez voir votre site apparaître sous *Sites* dans le *Gestionnaire IIS*. Vous pouvez maintenant démarrer le site et y accéder via un navigateur.
   - Ici nous avons ajouté notre application sous le répertoire `/capexploitation` de ce fait celle-ci est accessible via l'url : `fr-couvinove300.prod.paprec.fr/capexploitation`.

## Étape 3 : Activer le Proxy HTTP dans IIS

1. **Installer le module ARR**
   - Si le module ARR n'est pas déjà installé, téléchargez-le depuis [AAR](https://learn.microsoft.com/fr-fr/iis/extensions/planning-for-arr/using-the-application-request-routing-module)
   - Installez le module en suivant les instructions à l'écran.

2. **Activer le module de proxy HTTP** :
   - Ouvrez le gestionnaire de service IIS
    - Une fois sur votre serveur (ici fr-couvinove300), ouvrez AAR <br/> 
    - Cliquez ensuite sur ````Server Proxy```` Settings dans l'onglet action sur la droite
    - Cochez la case ````Enable proxy````

## Étape 4 : Installer et activer la réécriture d'URL

1. **Installer le module de réécriture d'URL** :
   - Si le module de réécriture d'URL n'est pas déjà installé, téléchargez-le depuis [IIS URL Rewrite Module](https://www.iis.net/downloads/microsoft/url-rewrite).
   - Installez le module en suivant les instructions à l'écran.

## Étape 5 : Configurer le Reverse Proxy avec la réécriture d'URL

Pour ce projet, nous avons besoin de créer un reverse proxy afin de communiquer avec l'api Altair.

1. **Créer une règle de réécriture pour le Reverse Proxy** :
   - Dans le *Gestionnaire IIS*, selectionnez votre site. Sous *Réécriture d'URL*, cliquez sur *Ajouter une règle*.
   - Sélectionnez *Reverse Proxy* parmi les modèles proposés.
   - Entrez l'URL de destination (ici exemple, `https://paprec.altairsystem.fr:443`).
   - Cochez la case *Autoriser le déchargement SSL*
   
2. **Configurer la règle de proxy inverse** :
   
   - Double cliquez sur la règle que vous venez de créer.
   - Entrez le modèle qui sera remplacé par la nouvelle URL, ici : `altairrest/(.*)`

4. **Valider et tester la configuration** :
   - Enregistrez les modifications.
   - Rendez-vous sur la plage d'accueil du cahier de quart et inspectez la page. Si aucune erreur de login sur altair n'est présente, le proxy est bien configuré.

## Étape 6 : Modifier la page d'accueil du server web

1. **Modifier le fichier iisstart.html**
   - Ouvrez le fichier ````C:\inetpub\wwwroot\iisstart.htm````
   - Ajoutez-y ce code : 
   ```html
      <!DOCTYPE html>
      <html lang="fr">
      <head>
         <meta charset="UTF-8">
         <meta http-equiv="refresh" content="0; url=https://fr-couvinove300.prod.paprec.fr/capexploitation/">
         <meta name="viewport" content="width=device-width, initial-scale=1.0">
         <title>Redirection</title>
      </head>
      <body>
         <p>Si vous n'êtes pas redirigé automatiquement, cliquez <a href="https://fr-couvinove300.prod.paprec.fr/capexploitation/">ici</a>.</p>
      </body>
      </html>
   ```
   - Enregistrez le fichier

2. **Modifier le fichier par défaut du serveur**
   - Rendez vous à la base de votre serveur web.
   - Cliquez sur l'icône `Document par défaut`.
   - Faites monter `iisstart.htm` en première position et sauvegardez.