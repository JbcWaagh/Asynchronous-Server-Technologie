const url = require('url');
const qs = require('querystring');
module.exports = {
  serverHandle: function (req, res) {
	res.writeHead(200, {'Content-Type': 'text/plain'});
	const path = url.parse(req.url).pathname;
	const queryParams = qs.parse(url.parse(req.url).query);
  	if(path==='/')
  	{
  		res.write("Bienvenue sur Hello. \n Pour plus d'information sur moi rejoignez l'url '/hello' avec mon nom (romain) comme parametre 'name'.  Exemple: localhost:8080/hello?name=romain\n "+
  					"Sinon vous pouvez mettre le votre pour que je vous salue")
  	}

  	else if (path === '/hello' && 'name' in queryParams) 
  	{
  		if(queryParams['name']==="romain"){
  			res.write("Bonjour, je suis Romain un etudiant de l'ECE en cybersecurite")
  		}
  		else{
    	res.write('Hello ' + queryParams['name'])
  		}
  	}
  	else if (path === '/hello')
  	{
  		res.write('Hello my friend')

  	}
  	else 
  	{
    	res.write('Erreur 404: Ressource not found :(')
  	}
  	res.end();
  }
}
