  import "chai/register-should"
  import { expect } from 'chai'
  import { Metric, MetricsHandler } from './metrics'
  import { LevelDb } from './leveldb'

  const a: number = 0


  const dbPath: string = 'db_test'
  var dbMet: MetricsHandler

  describe('Metrics', function () {
    before(function () {
      LevelDb.clear(dbPath)
      dbMet = new MetricsHandler(dbPath)
    })

    describe('#get', function () {
    it('should get empty array on non existing group', function () {
      dbMet.get("0", function (err: Error | null, result?: Metric[]) {
        expect(err).to.be.null
        expect(result).to.not.be.undefined
      //  console.log("result:")
        expect(result).to.be.empty
      })
    })
  })

  describe('#save', function () {
  it('should save data', function () {

    dbMet.save("1", [ { timestamp: '1384686660000', value: 11 } ],function (err: Error | null) {
      expect(err).to.be.null

    })
  })
  it('should get the metric we just created', function (done) {
    dbMet.get("1", function (err: Error | null, result?: Metric[]) {
      var met: Metric[] = [new Metric('1384686660000',11)];
    //  var met: Metric=
      var ts : string=result![0].timestamp
      var val: number=result![0].value
      expect(err).to.be.null
      expect(result).to.not.be.undefined
      expect(result).to.not.be.empty

  //    console.log(met[0])
        console.log(result)
      setTimeout(function(){
        done()
        console.log(result)

        expect(ts).to.equal('1384686660d000')
        expect(val).to.equal(11)
      },100)


    })
  })
  })

    after(function () {
    //  console.log("fin")
    //  LevelDb.clear(dbPath)
    })
  })
