import express = require('express')
import { MetricsHandler, Metric  } from './metrics'
import session = require('express-session')
import levelSession = require('level-session-store')
import { UserHandler, User } from './users'
import morgan = require('morgan')

const app = express()
const port: string = process.env.PORT || '8080'
const bodyParser = require('body-parser')
const LevelStore = levelSession(session)
const dbUser: UserHandler = new UserHandler('./db/users')
const path = require('path')


const metricsRouter = express.Router()
const devRouter = express.Router()
const authRouter = express.Router()

const metricsHandler= new MetricsHandler('./db/metrics');
const authCheck = (req: any, res: any, next: any) => {
    if (req.session.loggedIn) {
        next()
    } else res.redirect('/auth/login')
}

app.set('views', "./views")
app.set('view engine', 'ejs')

app.listen(port, (err: Error) => {
    if (err) {
        throw err
    }
    console.log(`server is listening on port ${port}`)
})

app.use(session({
    secret: 'my very secret phrase',
    store: new LevelStore('./db/sessions'),
    resave: true,
    saveUninitialized: true
}))
app.use(bodyParser.json())
app.use(morgan('dev'))
app.use(bodyParser.urlencoded())
app.use(express.static(path.join(__dirname, '/../public')))

app.use('/dev', devRouter)
app.use('/auth', authRouter)


app.get('/', authCheck,(req: any, res: any) => {
    if(req.session.loggedIn){
        res.render('index', {name: req.session.user.username})}
    else {
        res.render('index', {name: 'unconnected'})
    }
})


//Deconnexion
app.get('/logout', (req: any, res: any) => {
    delete req.session.loggedIn
    delete req.session.user
    res.redirect('/auth/login')
})

//Deconnexion
app.get('/logout', (req: any, res: any) => {
    delete req.session.loggedIn
    delete req.session.user
    res.redirect('/auth/login')
})

////////////////////////////////////////////////////////////////////
/////               auth Router                       //////////////
////Gestion de la connexion est création de compte     /////////////
////////////////////////////////////////////////////////////////////

///Récuperation de la page login
authRouter.get('/login', (req: any, res: any) => {
    res.render('login')
})

///Connexion à un compte
authRouter.post('/login', (req: any, res: any, next: any) => {
    if(req.body.username===""||req.body.password==="")
        res.status(401).send("merci de remplir tous les champs")
    else{
        dbUser.get(req.body.username, (err: Error | null, result?: User) => {
            if (err) res.status(401).send("Mauvais username ou MDP")
            else if (result === undefined || !result.validatePassword(req.body.password)) {
                res.status(401).send("mdp ou login inccorrect")
            } else {
                req.session.loggedIn = true
                req.session.user = result
                // res.status(200).send
                res.redirect('/')
            }
        })}
})

///Création d'un compte
authRouter.post('/signup', (req: any, res: any, next: any) => {
    const { username, email,password  } = req.body
    if(username===""||email===""||password==""){
        res.status(401).send("merci de remplir tous les champs")}
    else{
        const u = new User(username, email, password,false)
        dbUser.get(username,(err:Error|null,result?:User)=>{
            if(result!==undefined){
                res.status(400).send("l'utilisateur existe deja")
            }
            else{
                dbUser.save(u, (err: Error | null) => {
                    if (err){
                        res.status(404).send("user not saved")
                    }
                    else
                        res.status(200).send("Utilisateur enregistré, vous pouvez maintenant vous connecter")
                })}
        })
    }})

///Récuperation de la page signup
authRouter.get('/signup',(req:any,res:any,next:any)=>{
    res.render('signup')
})

////////////////////////////////////////////////////////////////////
/////               user Router                       //////////////
////routes pour les users connectés                     /////////////
////////////////////////////////////////////////////////////////////
app.use('/metrics', metricsRouter)

///Verification que le user soit bien connecté
metricsRouter.use(function (req: any, res: any, next: any) {
    authCheck(req,res,next)
})


///Recuperation de la liste des metrics du users
metricsRouter.get('/',(req:any,res:any,next:any)=>{

    metricsHandler.get(req.session.user.username,(err: Error|null,metrics:any)=>{
        console.log("access metrics")
        if(err)
            throw err
        else{
         //   console.log(user)
            res.render('metrics',{metrics:metrics,user:req.session.user.username})}
    })
})

///Supression de metrics
metricsRouter.post('/del/',(req:any,res:any,next:any)=>{
    metricsHandler.delete(req.session.user.username,req.body.timestamp,(err: Error|null)=>{
        if(err)
            throw err
        else{
            res.redirect('/metrics/')
        }
    })
})

///Ajout de metrics
metricsRouter.post ('/',(req:any,res:any,next:any)=>{
    if(req.body.timestamp===""||req.body.value==="")
        res.status(400).send("merci de remplir tous les champs")
    else{
        metricsHandler.save(req.session.user.username,[req.body],(err:Error|null)=>{
            if(err)
                res.status(401).send("le metrics n'a pas pu être sauvegardé" )
            else
                res.redirect('/metrics/')
        })}
})



////////////////////////////////////////////////////////////////////
/////               dev Router                       //////////////
////gestion et au dev du projet                     /////////////
////////////////////////////////////////////////////////////////////
/*
devRouter.get('/lsu',(req:any,res:any,next:any)=>{
    var listOfUser:any;
    dbUser.listall((err:Error|null,result:any)=>{
        res.status(200).json(result)
    })
})

devRouter.get('/lsm',(req:any,res:any,next:any)=>{
    var listOfUser:any;
    metricsHandler.list((err:Error|null,result:any)=>{
        res.status(200).json(result)
    })
})

devRouter.get('/del',(req:any,res:any,next:any)=>{
    var listOfUser:any;
    dbUser.deleteall((err:Error|null)=>{
        res.status(200).json(err)
    })
})
*/