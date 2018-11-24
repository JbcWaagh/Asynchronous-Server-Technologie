import { LevelDb } from './leveldb'
import WriteStream from 'level-ws'

export class Metric {
  public timestamp: Date
  public value: number

  constructor(ts: string, v: number) {
    this.timestamp = new Date(ts)
    this.value = v
  }
}

export class MetricsHandler {
  private db: any
  private path: string
  constructor(dbPath: string) {
    this.db = LevelDb.open(dbPath)
  }

  public save(key: number, metrics: Metric[], callback: (error: Error | null) => void) {
    const stream = WriteStream(this.db)
    stream.on('error', callback)
    stream.on('close', callback)
    metrics.forEach(m => {
      stream.write({ key: `metric:${key}${m.timestamp}`, value: m.value })
    })
    stream.end()
  }
  public get(callback: (error: Error | null, result?: Metric[]) => void) {
    console.log("path=")
    const result = [
      new Metric('2013-11-04 14:00 UTC', 12),
      new Metric('2013-11-04 14:30 UTC', 15)
    ]
    callback(null, result)
  }
}
