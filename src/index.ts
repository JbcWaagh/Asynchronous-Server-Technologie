import express = require('express')
import { MetricsHandler,, Metric  } from './metrics'

const app = express()
const port: string = process.env.PORT || '8080'
var bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded())
const metricsHandler= new MetricsHandler('./bdd');


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


app.post('/metrics/:id', (req: any, res: any) => {
  console.log("ok");
  MetricsHandler.save(req.params.id,req.body,(err: Error | null) => {
    if (err) {
      throw err
    }
    res.json(result)
  })
})

app.get('/metrics/:id', (req: any, res: any) => {
  MetricsHandler.get((err: Error | null, result?: any) => {
    if (err) {
      throw err
    }
    res.json(result)
  })
})
