import { LevelDb } from "./LevelDb"
import WriteStream from 'level-ws'
import {Metric} from "./metrics";
const bcrypt = require('bcrypt');

export class User {
    public username: string
    public email: string
    private password: string = ""

    constructor(username: string, email: string, password: string, passwordHashed: boolean = false) {
        this.username = username
        this.email = email

        if (!passwordHashed) {
            this.setPassword(password)
        } else this.password = password

    }


    static fromDb(data: any): User {
        return new User("ss","kk","jj")
    }

    public setPassword(toSet: string): void {
        var hash=bcrypt.hashSync(toSet,10)
        this.password=hash
    }

    public getPassword(): string {
        return this.password
    }

    public validatePassword(toValidate: String): boolean {
        return bcrypt.compareSync(toValidate, this.getPassword());

    }
}


export class UserHandler {
    public db: any

    public get(username: string, callback: (err: Error | null, result?: User) => void) {
     //   console.log("username:"+username)
        this.listall(err => {})
        this.db.get(`user:${username}`, function (err: Error|null, data: any) {
            if (err) {
                console.log(err)
                callback(err)}
            else
                callback(null, User.fromDb(data))
        })
    }

    public save(user: User, callback: (err: Error | null) => void) {
        //   console.log("savr begin")

        this.db.put(`user:${user.username}`,`${user.email}:${user.getPassword()}`   ,(err: Error|null)=>{
            callback(err)
        })
        //    console.log("savr dine")


    }

    public delete(username: string, callback: (err: Error | null) => void) {
        // TODO
    }
    public  listall(callback: (err:Error|null,result?:any)=>void)
    {
        const stream = this.db.createReadStream()
        var users:User[]=[]
        stream
            .on("error", (err: Error)=>{
                callback(err, users)
            })

            .on("end", () => {
                callback(null, users)
            })
            .on("data", (data: any) => {
                const [, key2, timestamp] = data.key.split(":")
                console.log(data)
                users.push(new User("tst",'tst','d'))       }
            )
    }
    public  deleteall(callback: (err:Error|null,result?:any)=>void)
    {
        const stream = this.db.createReadStream()
        var users:User[]=[]
        stream
            .on("error", (err: Error)=>{
                callback(err, users)
            })

            .on("end", () => {
                callback(null, users)
            })
            .on("data", (data: any) => {
                this.db.del(data.key)     }
            )
    }

    constructor(path: string) {
        this.db = LevelDb.open(path)
    }
}
