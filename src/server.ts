import express = require('express')
import { MetricsHandler, Metric  } from './metrics'
import session = require('express-session')
import levelSession = require('level-session-store')
import { UserHandler, User } from './users'

const app = express()
const port: string = process.env.PORT || '8080'
var bodyParser = require('body-parser')
const LevelStore = levelSession(session)
const dbUser: UserHandler = new UserHandler('./db/users')
const userRouter = express.Router()
const path = require('path')

console.log("path: "+path.join(__dirname, '/../public/css'))
app.use(express.static(path.join(__dirname, '/../public')))

app.set('views', "./views")
app.set('view engine', 'ejs')
app.use(session({
    secret: 'my very secret phrase',
    store: new LevelStore('./db/sessions'),
    resave: true,
    saveUninitialized: true
}))

const authCheck = function (req: any, res: any, next: any) {
    if (req.session.loggedIn) {
        next()
    } else res.redirect('/login')
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded())
const metricsHandler= new MetricsHandler('./db/metrics');


app.get('/', authCheck, (req: any, res: any) => {
    res.render('index', { name: req.session.username })
})

app.get('/login', (req: any, res: any) => {
    res.render('login')
})

app.post('/login', (req: any, res: any, next: any) => {
    dbUser.get(req.body.username, (err: Error | null, result?: User) => {
        if (err) next(err)
        if (result === undefined || !result.validatePassword(req.body.username)) {
            res.redirect('/login')
        } else {
            req.session.loggedIn = true
            req.session.user = result
            res.redirect('/')
        }
    })
})

app.get('/signup',(req:any,res:any,next:any)=>{
    res.render('signup')
})

app.post('/signup',(req:any,res:any,next:any)=>{

})

app.get('/logout', (req: any, res: any) => {
    delete req.session.loggedIn
    delete req.session.user
    res.redirect('/login')
})


app.get('/logout', (req: any, res: any) => {
    delete req.session.loggedIn
    delete req.session.user
    res.redirect('/login')
})



userRouter.post('/', (req: any, res: any, next: any) => {
    //  console.log(req.body)
    // dbUser.deleteall((err1:Error|null)=>{ })
    const { username, email,password  } = req.body
    if(username===""||email===""||password==""){
        res.status(401).send("merci de remplir tous les champs")}
    else{
        const u = new User(username, password, email)
        dbUser.get(username,(err:Error|null,result?:User)=>{
            //console.log(err)
            if(err===null){
                res.status(400).send("l'utilisateur existe deja")
            }
            else{
                dbUser.save(u, (err: Error | null) => {
                    if (err){
                        res.status(404).send("user not saved")
                    }
                    else
                        res.status(200).send("user saved")
                })}
        })
    }})

userRouter.get('/', (req: any, res: any, next: any) => {
    dbUser.get(req.body.username, (err: Error | null, result?: User) => {
        if (err) next(err)
        if (result === undefined || !result.validatePassword(req.body.username)) {
            res.status(404).send("user not found")
        } else {
            res.status(200).json(result)
        }
    })
})

app.use('/user', userRouter)

app.get('/', (req: any, res: any) => {
    res.write('Hello world')
    res.end()
})

app.listen(port, (err: Error) => {
    if (err) {
        throw err
    }
    console.log(`server is listening on port ${port}`)
})


app.delete('/metrics/:id', (req: any, res: any) => {
    metricsHandler.delete(req.params.id,(err: Error | null) => {
        if (err) {
            throw err
        }
        res.status(200).send();
    })
})

app.post('/metrics/:id', (req: any, res: any) => {
    console.log(req.body)
    console.log(req.params.id)

    metricsHandler.save(req.params.id,req.body,(err: Error | null) => {
        if (err) {
            throw err
        }
        res.status(200).send();
    })
})

app.get('/metrics/:id', (req: any, res: any) => {
    metricsHandler.get(   req.params.id,(err: Error | null, result?: any) => {
        if (err) {
            throw err
        }
        console.log("result:");
        console.log(result);
        res.json(result)
    })
})
