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
var exec = require('child_process').exec;
var execFile = require('child_process').execFile;
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

app.post('/host', function (req, res) {
    var host = req.body.host || '';

    // Test for everything besides alphanumeric and . and -
    // Also test for starting . and -
    if(host.match(/^[-\.]|[^a-zA-Z0-9\-\.]/)) {
        res.status(400).send('Invalid input');
        return;
    }

    execFile('/usr/bin/host', [host], function (err, stdout, stderr) {
        // ...
        if(err || stderr) {
            console.error(err || stderr);
            res.sendStatus(500);
            return;
        }
        res.send(
            '<h3>Lookup for: ' + host + '</h3>' +
            '<pre>' + stdout + '</pre>' +
            form
        );
    });
});

//app.listen(3000);
app.listen(8080, function () {
  console.log('Example app listening on port 8080!')
});
