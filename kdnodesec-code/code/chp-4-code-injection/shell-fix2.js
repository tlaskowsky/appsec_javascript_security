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

var opts = {};
app.post('/host', function (req, res) {
    // Add options specifying uid, which we asked from system
    exec('host ' + req.body.host, opts, function (err, stdout, stderr) {
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
// Look for the nobody user

// NOTE:
// On OSX this can cause an error because the UID of nobody
// is a negative number (-1) represented by overflowing integer
exec('id -u nobody', function (err, stdout, stderr) {
    if(err || stderr) {
        console.error(err || stderr);
        process.exit(1);
    }

    // Set the uid in the options
    opts.uid = +stdout;

    // Start server
    console.log('Nobody is ' + opts.uid);
    console.log('Listening on 3000');
    app.listen(3000);
});
