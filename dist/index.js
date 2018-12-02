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
    console.log("server is listening on port " + port);
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
    console.log(req.body);
    console.log(req.params.id);
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
        console.log("result:");
        console.log(result);
        res.json(result);
    });
});
