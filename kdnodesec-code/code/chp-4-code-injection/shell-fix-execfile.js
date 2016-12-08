/***
 * Excerpted from "Secure Your Node.js Web Application",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/kdnodesec for more book information.
***/
'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var form = '' +
    '<form method="POST" action="/host">' +
    '<input type="text" name="host" placeholder="host" />' +
    '<input type="submit" value="Get host" />' +
    '</form>';

app.get('/', function(req, res){
    res.send(form);
});

app.use(bodyParser.urlencoded({extended: false}));

var execFile = require('child_process').execFile;

app.post('/host', function (req, res) {
    execFile('/usr/bin/host', [req.body.host], function (err, stdout, stderr) {
        // . . .
        if(err || stderr) {
            console.error(err || stderr);
            res.sendStatus(500);
            return;
        }
        res.send(
            '<h3>Lookup for: ' + req.body.host + '</h3>' +
            '<pre>' + stdout + '</pre>' +
            form
        );
    });
});

//app.listen(3000);
app.listen(8080, function () {
  console.log('Example app listening on port 8080!')
});
