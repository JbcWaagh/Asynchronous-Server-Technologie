

Asynchronous Server Technologies
================================

## Prérequis

Cette application nécessite d'avoir NodejS

Fonctionnement
--------------

### Pour installer ExpressJS:
Utiliser la commande:  
```
nmp i express
```

### Pour lancer le serveur:  
Utiliser la commande:
```
npm start
```


### Pour acceder à un metric:  

```
localhost:8080/metrics/'id_metric'
```

### Ajouter un metric:  

Requete Post sur:
```
localhost:8080/metrics/'id_metric'
```
Mettre le metric dans le body


### Supprimer un metric:  

Requete Delete sur:
```
localhost:8080/metrics/'id_metric'
```

### Version de nodeJS utilisé pour le développement
v10.13.0


Auteur:
------
Romain Michau
romain.michau@edu.ece.fr
