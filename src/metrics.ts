import { LevelDb } from './leveldb'
import WriteStream from 'level-ws'

export class Metric {
  public timestamp: string
  public value: number

  constructor(ts: string, v: number) {
    this.timestamp=ts
    this.value = v
  }
}

export class MetricsHandler {
  private db: any
  constructor(dbPath: string) {
    this.db = LevelDb.open(dbPath)
  }


  public delete(key: string,callback: (error: Error | null) => void){
    const stream = this.db.createReadStream();

    stream
      .on("error", callback) 
      .on("end", (err: Error) => {
        callback(null);
      })
      .on("data", (data: any) => {
        this.db.del(data.key);

   });
  }


  public save(key: string, metrics: Metric[], callback: (error: Error | null) => void) {
    const stream = WriteStream(this.db)
    stream.on('error', callback)
    stream.on('close', callback)
    metrics.forEach(m => {
      stream.write({ key: `metric:${key}:${m.timestamp}`, value: m.value })
    })
    stream.end()
  }


  public get(key:string, callback: (error: Error | null, result?: Metric[]) => void) {

   const stream = this.db.createReadStream();
   var met: Metric[] = [];

   stream
     .on("error", callback)
     .on("end", (err: Error) => {
       callback(null, met);
     })
     .on("data", (data: any) => {
       const [, key2, timestamp] = data.key.split(":");
       if (key === key2) {
         console.log( "data:"+data+"\n timestamp:"+timestamp+"\n");
         met.push(new Metric(timestamp, data.value));       }

  });
    }
}
