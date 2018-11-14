express = require('express')
app = express()


const mesInfo="Bonjour, je suis Romain un etudiant de l'ECE en cybersecurite";
const descSite="Bienvenue sur Hello. \n Pour plus d'information sur moi rejoignez l'url '/hello' avec mon nom (romain) comme parametre 'name'.  Exemple: localhost:8080/hello?name=romain\n "+
  				"Sinon vous pouvez mettre le votre pour que je vous salue";
const helloInc="Hello my friend";
const e404='Erreur 404: Ressource not found :(';

app.set('port', 8080)

app.listen(
  app.get('port'), () => console.log(`server listening on ${app.get('port')}`)
)

app.get(
  '/hello',
  (req, res) => res.send(helloInc)
)

app.get(
  '/hello/:name',
  (req, res) => {
    if (req.params.name == 'romain'){
      res.send(mesInfo)
    } else {
      res.send("Hello " + req.params.name)
    }
  }
)


app.get(
  '/',
  (req, res) => res.send(descSite)
)

app.use(function(req, res){
       res.send(e404);
   });
