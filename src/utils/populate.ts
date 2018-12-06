import { UserHandler, User } from '../users'
import { MetricsHandler, Metric  } from '../metrics'
import {LevelDb} from "../leveldb"

const dbPathm: string = 'db/metrics'
const dbPathu: string = 'db/users'
const dbPaths: string = 'db/sessions'

LevelDb.clear(dbPathm)
LevelDb.clear(dbPathu)
LevelDb.clear(dbPaths)

const metricsHandler= new MetricsHandler('./db/metrics')
const dbUser: UserHandler = new UserHandler('./db/users')


/////AJOUT DES USERS
dbUser.save(new User('romain','romain.michau@edu.ece.fr','secretr'),(err:Error|null)=>{
    if(err)
        throw err
})
dbUser.save(new User('fabrice','fabrice.locqueville@edu.ece.fr','secretf'),(err:Error|null)=>{
    if(err)
        throw err
})
dbUser.save(new User('alexandre','alexandre.casara@edu.ece.fr','secreta'),(err:Error|null)=>{
    if(err)
        throw err
})


/////AJOUT DES METRICS
const mft: Metric[]=[new Metric('2011-10-10',15),new Metric('2012-12-10',14),new Metric('2013-01-20',1)]

metricsHandler.save('fabrice',mft,(err:Error|null)=>{
    if(err)
        throw err
})

const mfr: Metric[]=[new Metric('1996-01-31',15),new Metric('1997-05-11',14),new Metric('1997-09-13',1)]

metricsHandler.save('romain',mfr,(err:Error|null)=>{
    if(err)
        throw err
})

const mfa: Metric[]=[new Metric('2000-01-22',15),new Metric('2001-05-20',14),new Metric('2002-08-11',1)]

metricsHandler.save('alexandre',mfa,(err:Error|null)=>{
    if(err)
        throw err
})

console.log("populate done ✅")