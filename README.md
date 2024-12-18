# INOVEX ANGULAR

# Développement :
### * Chaque site posséde sa branche (`CHI` : Chinon, `PIT` : Pithiviers, `NOY` : Noyelles)
### * La branche `main` est la branche de base qui sera utilisé pour chaque nouveau site (création d'une branche spécifique à partir de celle ci)
### * Pour des développements spécifique à un site :
##### - `Si Dev mineur` => modification directement sur la `branche spécifique`
##### - `Si fonctionnalité importante` => création d'une nouvelle branche (à partir de la `branche spécifique`) puis Pull Request vers la `branche spécifique` une fois les développements testés
### * Pour des développements concernant l'ensemble des sites :
##### - `Si Dev mineur` => modification directement sur la` branche main`
##### - `Si fonctionnalité importante` => création d'une nouvelle branche (à partir de la `branche main`) puis Pull Request vers la `branche main` une fois les développements testés

# Prérequis --  il faut installer :
### `Node.js` : https://nodejs.org/en/download/
### `npm` : `npm install -g npm@latest`
### `angular/cli` : `npm install -g @angular/cli`
### `npm i` pour installer l'intégralité des dépendances du projet (être à l'intérieur du projet)


# Lancer l'appli :
`ng serve --port numPort --host 0.0.0.0`

# Créer un Component :
`ng generate component nomComponent`

# ATTENTION lors de la création d'un service :
`ajouter ce service dans le tableau des providers du fichier app.module.ts`

# Procédure de déploiement IIS
Prérequis : 
- Installer [IIS](https://learn.microsoft.com/fr-fr/iis/application-frameworks/scenario-build-an-aspnet-website-on-iis/configuring-step-1-install-iis-and-asp-net-modules) sur la machine
- Installer [AAR](https://learn.microsoft.com/fr-fr/iis/extensions/planning-for-arr/using-the-application-request-routing-module)
- Installer [URL Rewrite](https://www.iis.net/downloads/microsoft/url-rewrite)

Etapes de déploiement : 

1. Activer les proxy
    - Ouvrez le gestionnaire de service IIS
    - Une fois sur votre serveur (ici fr-couvinove300), ouvrez AAR <br/> 
    <p style="text-align: center;"> <img src="image.png"/> </p> <br/>
    - Cliquez ensuite sur ````Server Proxy```` Settings dans l'onglet action sur la droite
<p style="text-align: center;"> <img src="image-1.png"/> </p> <br/>

    - Cochez la case ````Enable proxy````

2. Déployer l'application
    - 

    <p style="text-align: center;"> <img src="image.png"/> </p> <br/>


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
    - Allez dans un terminal, dans le dossier de l'application entrez la commande : ````ng build --base-href /capexploitation/ --configuration production````

2. **Ajout du code dans le serveur**
    - Une fois le build terminé, copiez le contenu du dossier 
## Étape 3 : Créer un nouveau site Web sur IIS

1. **Ouvrir IIS Manager** :
   - Allez dans *Panneau de configuration* > *Outils d'administration* > *Gestionnaire des services Internet (IIS)*.

2. **Ajouter un site Web** :
   - Dans le *Gestionnaire IIS*, faites un clic droit sur *Sites* puis cliquez sur *Ajouter un site*.
   - Remplissez les informations nécessaires :
     - *Nom du site* : Choisissez un nom pour votre site (ici `CAP Exploitation`).
     - *Chemin du dossier physique* : Sélectionnez le répertoire où se trouvent vos fichiers du site. (Ici)
     - *Nom d'hôte* : Si vous utilisez un nom de domaine, entrez-le ici (par exemple `www.monsite.com`).
     - *Port* : Par défaut, le port 80 est utilisé pour HTTP. Si nécessaire, configurez un autre port.

3. **Valider la création** :
   - Une fois le site ajouté, vous devriez voir votre site apparaître sous *Sites* dans le *Gestionnaire IIS*. Vous pouvez maintenant démarrer le site et y accéder via un navigateur.

---

## Étape 3 : Activer le Proxy HTTP dans IIS

1. **Activer le module de proxy HTTP** :
   - Dans le *Gestionnaire IIS*, sélectionnez votre serveur (nom de votre machine) dans la colonne de gauche.
   - Sous *Fonctionnalités du serveur*, cliquez sur *Proxy HTTP*.
   - Cochez la case *Activer le proxy HTTP* pour activer cette fonctionnalité.

2. **Configurer le Proxy** :
   - Dans le même menu, vous pouvez configurer les paramètres du proxy, comme l'adresse du serveur proxy et les ports utilisés. Par défaut, IIS va utiliser le proxy du système d'exploitation.

---

## Étape 4 : Installer et activer la réécriture d'URL

1. **Installer le module de réécriture d'URL** :
   - Si le module de réécriture d'URL n'est pas déjà installé, téléchargez-le depuis [IIS URL Rewrite Module](https://www.iis.net/downloads/microsoft/url-rewrite).
   - Installez le module en suivant les instructions à l'écran.

2. **Configurer la réécriture d'URL** :
   - Dans le *Gestionnaire IIS*, sélectionnez votre site web.
   - Sous *Fonctionnalités du site*, cliquez sur *Réécriture d'URL*.
   - Cliquez sur *Ajouter une règle* pour définir une nouvelle règle de réécriture.
     - Exemple : Vous pouvez créer une règle pour rediriger les requêtes HTTP vers HTTPS, ou bien effectuer une réécriture d'URL pour un reverse proxy.

---

## Étape 5 : Configurer le Reverse Proxy avec la réécriture d'URL

1. **Créer une règle de réécriture pour le Reverse Proxy** :
   - Dans le *Gestionnaire IIS*, sous *Réécriture d'URL*, cliquez sur *Ajouter une règle*.
   - Sélectionnez *Reverse Proxy* parmi les modèles proposés.
   
2. **Configurer la règle de proxy inverse** :
   - Entrez l'URL de destination (par exemple, `http://backend-server.local`).
   - Configurez les règles pour faire correspondre les chemins d'URL de votre serveur proxy et de votre serveur de destination.

3. **Activer les proxys sur les ports nécessaires** :
   - Assurez-vous que les ports de communication entre IIS et votre serveur backend (par exemple, 8080) sont ouverts et accessibles.
   - Vérifiez que les adresses d'IP du serveur backend ne sont pas bloquées par un pare-feu.

4. **Valider et tester la configuration** :
   - Enregistrez les modifications et testez la configuration en accédant à votre site à travers le proxy.
   - Par exemple, si votre site est configuré pour faire le proxy inverse vers `http://backend-server.local`, essayez de naviguer à l'adresse `http://monsite.com` et vérifiez que le contenu du backend s'affiche correctement.

---

## Conclusion

Vous avez maintenant un site web fonctionnant sur IIS, avec un proxy HTTP activé et une réécriture d'URL configurée pour agir en reverse proxy. Vous pouvez maintenant ajouter des fonctionnalités supplémentaires, comme la gestion des erreurs, des certificats SSL, ou d'autres règles de réécriture d'URL pour adapter davantage votre configuration.

---

## Ressources supplémentaires

- [Documentation officielle IIS](https://docs.microsoft.com/en-us/iis/)
- [URL Rewrite Module](https://www.iis.net/downloads/microsoft/url-rewrite)
- [Proxy HTTP sur IIS](https://docs.microsoft.com/en-us/iis/extensions/url-rewrite-module/reverse-proxy)