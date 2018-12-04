import "chai/register-should"
import {
    expect
} from 'chai'
import {
    Metric,
    MetricsHandler
} from './metrics'
import {
    LevelDb
} from './leveldb'

const a: number = 0


const dbPath: string = 'db_test/metrics'
var dbMet: MetricsHandler

describe('Metrics', function() {
    before(function() {
        LevelDb.clear(dbPath)
        dbMet = new MetricsHandler(dbPath)
    })

    describe('#get', function() {
        it('should get empty array on non existing group', function() {
            dbMet.get("0", function(err: Error | null, result ? : Metric[]) {
                expect(err).to.be.null
                expect(result).to.not.be.undefined
                expect(result).to.be.empty
            })
        })
    })

    describe('#save', function() {
        it('should save data', function(done) {

            dbMet.save("1", [{
                timestamp: '1384686660000',
                value: 11
            },
            {
                timestamp: '13846586660000',
                value: 11
            }], function(err: Error | null) {
                expect(err).to.be.null
                done()

            })
        })
    })

    describe('#Delete', function() {
        it('should delete a data', function(done) {
            dbMet.delete('11', (err: Error | null) => {
              expect(err).to.be.null
              done()
            })
        })
    })


    after(function() {
        //  LevelDb.clear(dbPath)
    })
})
