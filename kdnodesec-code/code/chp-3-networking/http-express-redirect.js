/***
 * Excerpted from "Secure Your Node.js Web Application",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/kdnodesec for more book information.
***/
'use strict';

var fs = require('fs');
var http = require('http');
var https = require('https');
var express = require('express');

var app = express();
app.get('/', function (req, res, next) {
    res.send('hello world');
});

var options = {
    key: fs.readFileSync(__dirname + '/certs/key.pem'),
    cert: fs.readFileSync(__dirname + '/certs/cert.pem')
};

https.createServer(options, app).listen(443);

var httpApp = express();
httpApp.get('*', function (req, res){
    res.redirect('https://' + req.headers.host + req.url);
});
httpApp.listen(80);
