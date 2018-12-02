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
            console.log("delete_error");
            callback(err);
        })
            .on("end", function () {
            console.log("delete_end");
            callback(null);
        })
            .on("data", function (data) {
            console.log("delete_data");
            _this.db.del(data.key);
        });
    };
    MetricsHandler.prototype.save = function (key, metrics, callback) {
        var stream = level_ws_1.default(this.db);
        stream.on('error', function (err) {
            console.log("Save_error");
            callback(err);
        })
            .on('close', function () {
            console.log("Save_close");
            callback(null);
        })
            .on("end", function () {
            console.log("Save_end");
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
            console.log("error_get");
            callback(err, met);
        })
            .on("end", function () {
            console.log("end_get");
            callback(null, met);
        })
            .on("data", function (data) {
            console.log("data_get");
            var _a = data.key.split(":"), key2 = _a[1], timestamp = _a[2];
            if (key === key2) {
                //       console.log( "data:"+data+"\n timestamp:"+timestamp+"\n");
                met.push(new Metric(timestamp, data.value));
            }
        });
    };
    return MetricsHandler;
}());
exports.MetricsHandler = MetricsHandler;
