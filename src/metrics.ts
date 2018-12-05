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
    private dbPath:string

    constructor(dbPath: string) {
        this.dbPath=dbPath
        this.db = LevelDb.open(dbPath)
    }

    public close(){

    }


    public delete(key: string,timestamp:string,callback: (error: Error | null) => void){
        const stream = this.db.createReadStream();
        stream
            .on("error",(err: Error) => {
                callback(err);
            })

            .on("end", () => {
                callback(null);
            })

            .on("data", (data: any) => {
                const [, keyC, timestampC] = data.key.split(":")
           //
                if(keyC==key &&timestampC==timestamp){
                    this.db.del(data.key)
                }


            });
    }


    public save(key: string, metrics: Metric[], callback: (error: Error | null) => void) {
        const stream = WriteStream(this.db)
        stream.on('error',(err: Error)=>{
            callback(err)      })
            .on('close', ()=>{
                callback(null)
            })
            .on("end", () => {
                callback(null);
            })
        metrics.forEach(m => {
            stream.write({ key: `metric:${key}:${m.timestamp}`, value: m.value })
        })
        stream.end()
    }


    public get(key:string, callback: (error: Error | null, result?: Metric[]) => void) {

        const stream = this.db.createReadStream()
        var met: Metric[] = []

        stream
            .on("error", (err: Error)=>{
                callback(err, met)
            })

            .on("end", () => {
                callback(null, met)
            })
            .on("data", (data: any) => {
                const [, key2, timestamp] = data.key.split(":")
                if (key === key2) {
                    met.push(new Metric(timestamp, data.value))       }

            })
    }

    public list( callback: (error: Error | null, result?: string[],resultkey?: string[]) => void) {

        const stream = this.db.createReadStream()
        var met: string[] = []
        var resultkey: string[]=[];

        stream
            .on("error", (err: Error)=>{
                callback(err, met)
            })

            .on("end", () => {
                callback(null, met,resultkey)
            })
            .on("data", (data: any) => {
                const [, key2, timestamp] = data.key.split(":")
                {
                    met.push(key2+" "+timestamp+"  "+data.value)
                    resultkey.push(key2)
                }

            })
    }
}
