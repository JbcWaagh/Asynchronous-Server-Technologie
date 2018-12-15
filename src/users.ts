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

    static fromDb(data:any): User {
        const[email,password]=data.value.split(':')
        const[,username]=data.key.split(':')
        return new User(username, email, password,true)
    }

    public setPassword(toSet: string): void {
        const hash=bcrypt.hashSync(toSet,10)
        this.password=hash
    }

    public getPassword(): string {
        return this.password
    }

    public validatePassword(toValidate: String): boolean {
       return  bcrypt.compareSync(toValidate, this.getPassword()) // true
    }
}


export class UserHandler {
    public db: any


    //Getter de user
    public get(username: string, callback: (err: Error | null, result?: User) => void) {
        const stream = this.db.createReadStream()
        var user: User

        stream
            .on("error", (err: Error)=>{
                callback(err)
            })
            .on("end", () => {
                callback(null, user)
            })
            .on("data", (data: any) => {
                const [, key2] = data.key.split(":")
                if (username === key2) {
                    user=User.fromDb(data)       }

            })
    }


    //Sauvegarde d'un User
    public save(user: User, callback: (err: Error | null) => void) {
        this.db.put(`user:${user.username}`,`${user.email}:${user.getPassword()}`   ,(err: Error|null)=>{
            if(err)
            callback(err)
        })
    }



    ///Fonction pour listé tous les users (fonction utilisé pour le dev)
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
                users.push(User.fromDb(data))       }
            )
    }

    ///Supression de tous les users (fonction utilisé uniquement pour le dev)
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
