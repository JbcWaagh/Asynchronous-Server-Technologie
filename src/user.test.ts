import "chai/register-should"
import {
    expect
} from 'chai'
import { UserHandler, User } from './users'

import {
    LevelDb
} from './leveldb'

const dbPath: string = 'db_test/users'
var dbUser: UserHandler

describe('Users', function() {
    before(function() {
        LevelDb.clear(dbPath)
        dbUser = new UserHandler(dbPath)
    })

    describe('#get', function() {
        it('should get empty array on non existing group', function(done) {
            dbUser.get("test", function(err: Error | null, result ? : User) {
                expect(err).to.be.null
                expect(result).to.be.undefined
                done()
            })
        })
    })

    describe('#save', function() {
        it('should save user', function() {
            dbUser.save(new User("username_tst","username_tst@mail.fr","password_tst"), (err: Error | null)=> {
                expect(err).to.be.null
            })
        })
    })

    describe('#Delete', function() {
        it('should delete a user', function() {
            dbUser.delete('username_tst', (err: Error | null) => {
                expect(err).to.be.null
            })
        })
    })
})
