"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var leveldb_1 = require("./leveldb");
var level_ws_1 = __importDefault(require("level-ws"));
var Metric = /** @class */ (function () {
    function Metric(ts, v) {
        this.timestamp = ts;
        this.value = v;
    }
    return Metric;
}());
exports.Metric = Metric;
var MetricsHandler = /** @class */ (function () {
    function MetricsHandler(dbPath) {
        this.dbPath = dbPath;
        this.db = leveldb_1.LevelDb.open(dbPath);
    }
    MetricsHandler.prototype.close = function () {
    };
    MetricsHandler.prototype.delete = function (key, callback) {
        var _this = this;
        var stream = this.db.createReadStream();
        stream
            .on("error", function (err) {
            callback(err);
        })
            .on("end", function () {
            callback(null);
        })
            .on("data", function (data) {
            _this.db.del(data.key);
        });
    };
    MetricsHandler.prototype.save = function (key, metrics, callback) {
        var stream = level_ws_1.default(this.db);
        stream.on('error', function (err) {
            callback(err);
        })
            .on('close', function () {
            callback(null);
        })
            .on("end", function () {
            callback(null);
        });
        metrics.forEach(function (m) {
            stream.write({ key: "metric:" + key + ":" + m.timestamp, value: m.value });
        });
        stream.end();
    };
    MetricsHandler.prototype.get = function (key, callback) {
        var stream = this.db.createReadStream();
        var met = [];
        stream
            .on("error", function (err) {
            callback(err, met);
        })
            .on("end", function () {
            callback(null, met);
        })
            .on("data", function (data) {
            var _a = data.key.split(":"), key2 = _a[1], timestamp = _a[2];
            if (key === key2) {
                met.push(new Metric(timestamp, data.value));
            }
        });
    };
    return MetricsHandler;
}());
exports.MetricsHandler = MetricsHandler;
