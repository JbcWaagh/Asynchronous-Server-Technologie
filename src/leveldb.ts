import encoding from 'encoding-down'
import leveldown from 'leveldown'
import levelup from 'levelup'
import del = require('del')
import fs = require('fs')

export class LevelDb {
  static open(path: string) {
    const encoded = encoding(leveldown(path), { valueEncoding: 'json' })
    return levelup(encoded)
  }


  static clear(path: string) {
    if (fs.existsSync(path)) {
      del.sync(path, { force: true })
    }
  }


}
