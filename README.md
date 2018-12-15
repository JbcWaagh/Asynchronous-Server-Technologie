

Asynchronous Server Technologies
================================

## Prérequis

Cette application nécessite d'avoir NodejS d'installé

Fonctionnement
--------------

### Installations des outils :
```
npm install
```

### lancer les test unitaires:
```
npm test
```

###  Pour remplir la DB :
```
npm run populate
```


### Pour lancer le serveur:  
Utiliser la commande:
```
npm start
```

### Comptes utilisateurs par défaut:
login: romain
mdp: secretr 

login: farice
mdp: secretf 

login: alexandre 
mdp: secreta

###routes:
####auth (connexion ou création de compte)
http://localhost:8080/auth/signup   
http://localhost:8080/auth/login  

####Page Home
http://localhost:8080/

####metrics (page pour voir les metrics de l'utilisateur) 
http://localhost:8080/metrics



### Version de nodeJS utilisé pour le développement
v10.13.0


Auteur:
------
Romain Michau
romain.michau@edu.ece.fr
