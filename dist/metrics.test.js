"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("chai/register-should");
var chai_1 = require("chai");
var metrics_1 = require("./metrics");
var leveldb_1 = require("./leveldb");
var a = 0;
var dbPath = 'db_test';
var dbMet;
describe('Metrics', function () {
    before(function () {
        leveldb_1.LevelDb.clear(dbPath);
        dbMet = new metrics_1.MetricsHandler(dbPath);
    });
    describe('#get', function () {
        it('should get empty array on non existing group', function () {
            dbMet.get("0", function (err, result) {
                chai_1.expect(err).to.be.null;
                chai_1.expect(result).to.not.be.undefined;
                //  console.log("result:")
                chai_1.expect(result).to.be.empty;
            });
        });
    });
    describe('#save', function () {
        it('should save data', function () {
            dbMet.save("1", [{ timestamp: '1384686660000', value: 11 }], function (err) {
                chai_1.expect(err).to.be.null;
            });
        });
        it('should get the metric we just created', function () {
            dbMet.get("1", function (err, result) {
                var met = [new metrics_1.Metric('1384686660000', 11)];
                //  var met: Metric=
                var ts = result[0].timestamp;
                //var val: number=result[0].value
                chai_1.expect(err).to.be.null;
                chai_1.expect(result).to.not.be.undefined;
                chai_1.expect(result).to.not.be.empty;
                console.log(met[0]);
                console.log(result);
                chai_1.expect(ts).to.equal('1384686660000');
                //  expect(val).to.equal(11)
            });
        });
    });
    after(function () {
        //  console.log("fin")
        //  LevelDb.clear(dbPath)
    });
});
