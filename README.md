Romain Michau


Asynchronous Server Technologies TP1
======================================


Introduction
------------
Ce TP est une introduction à Node JS consistant à mettre en place une première application contenant 3 routes.


Fonctionnement
--------------

#Pour lancer le serveur:  
Utiliser la commande:
node .\index.js


###Les 3 routes de notre applications sont:  

* localhost:8080/
* localhost:8080/hello?name=romain
* localhost:8080/hello?name=xxx

###Page home  
Accessible via :localhost:8080/  
Cette page vous décrit le fonctionnement de l'application.

###Page Hello romain  
Accessible via: localhost:8080/hello?name=romain  
Cette page vous montre présentation de moi même

###Page Hello xxx  
Avec xxx un prénom aléatoire  
Accessible via: localhost:8080/hello?name=xxx  
Cette page salut xxx

###Autres pages
Une erreur 404 sera affichée
