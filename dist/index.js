"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var metrics_1 = require("./metrics");
var app = express();
var port = process.env.PORT || '8080';
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
var metricsHandler = new metrics_1.MetricsHandler('./bdd');
app.get('/', function (req, res) {
    res.write('Hello world');
    res.end();
});
app.listen(port, function (err) {
    if (err) {
        throw err;
    }
});
app.delete('/metrics/:id', function (req, res) {
    metricsHandler.delete(req.params.id, function (err) {
        if (err) {
            throw err;
        }
        res.status(200).send();
    });
});
app.post('/metrics/:id', function (req, res) {
    metricsHandler.save(req.params.id, req.body, function (err) {
        if (err) {
            throw err;
        }
        res.status(200).send();
    });
});
app.get('/metrics/:id', function (req, res) {
    metricsHandler.get(req.params.id, function (err, result) {
        if (err) {
            throw err;
        }
        res.json(result);
    });
});
