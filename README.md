# INOVEX ANGULAR

# Développement :
### Chaque site posséde sa branche (CHI : Chinon, PIT : Pithiviers, NOY : Noyelles)
### La branche main est la branche de base qui sera utilisé pour chaque nouveau site (création d'une branche spécifique à partir de celle ci)
### Pour des développements spécifique à un site :
#### - Si Dev mineur => modification directement sur la branche en question
#### - Si fonctionnalité importante => création d'une nouvelle branche (à partir de la branche spécifique) puis Pull Request vers la branche spécifique une fois les développements testés
### Pour des développements concernant l'ensemble des sites :
#### - Si Dev mineur => modification directement sur la branche main
#### - Si fonctionnalité importante => création d'une nouvelle branche (à partir de la branche main) puis Pull Request vers la branche main une fois les développements testés

# Prérequis --  il faut installer :
### Node.js : https://nodejs.org/en/download/
### npm : npm install -g npm@latest
### angular/cli : npm install -g @angular/cli
### npm i pour installer l'intégralité des dépendances du projet (être à l'intérieur du projet)


# Lancer l'appli :
ng serve --port numPort --host 0.0.0.0

# Créer un Component :
ng generate component nomComponent
