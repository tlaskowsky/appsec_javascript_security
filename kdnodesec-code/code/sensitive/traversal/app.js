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
var fs = require('fs');
var app = express();

//Construct path
function getPath(filename) {
    return __dirname + '/public/' + filename;
}

app.get('/', function (req, res) {
    if(!req.query.file) {
        res.sendStatus(404);
        return;
    }
    var filePath = getPath(req.query.file);
    var stream = fs.createReadStream(filePath);

    //Handle errors
    stream.on('error', function (err) {
        var status = err.code === 'ENOENT' ? 404 : 500;
        res.sendStatus(status);
    });

    stream.pipe(res);
});

app.listen(3000);