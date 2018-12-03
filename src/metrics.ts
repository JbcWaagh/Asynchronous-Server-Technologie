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


    public delete(key: string,callback: (error: Error | null) => void){
        const stream = this.db.createReadStream();

        stream
            .on("error",(err: Error) => {
                //    console.log("delete_error")
                callback(err);
            })

            .on("end", () => {
                //    console.log("delete_end")
                callback(null);
            })

            .on("data", (data: any) => {
                //    console.log("delete_data")
                this.db.del(data.key);

            });
    }


    public save(key: string, metrics: Metric[], callback: (error: Error | null) => void) {
        const stream = WriteStream(this.db)
        stream.on('error',(err: Error)=>{
            //    console.log("Save_error")
            callback(err)      })

            .on('close', ()=>{
                //    console.log("Save_close")
                callback(null)
            })

            .on("end", () => {
                //  console.log("Save_end")
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
                //   console.log("error_get");
                callback(err, met)
            })

            .on("end", () => {
                //     console.log("end_get");
                callback(null, met)
            })
            .on("data", (data: any) => {
                //   console.log("data_get");
                const [, key2, timestamp] = data.key.split(":")
                if (key === key2) {
                    //       console.log( "data:"+data+"\n timestamp:"+timestamp+"\n");
                    met.push(new Metric(timestamp, data.value))       }

            })
    }
}
