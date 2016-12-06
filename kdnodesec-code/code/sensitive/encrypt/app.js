/***
 * Excerpted from "Secure Your Node.js Web Application",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/kdnodesec for more book information.
***/
'use strict';

var bodyParser = require('body-parser');
var express = require('express');
var app = express();

var CC = require('./models/cc');

app.get('/cc', function (req, res) {
    var form = '<form method="POST">' +
        '<input autocomplete="off" name="cc" />' +
        '<input type="submit" value="Submit" />' +
        '</form>';
    res.send(form);
});

app.post('/cc', bodyParser.urlencoded(), function (req, res) {
    // Create creditcard from post data
    CC.create(req.body, function (err, cc) {

        //Had an error
        if(err) {
            console.error(err);
            res.sendStatus(500);
            return;
        }

        res.redirect('/cc/' + cc._id);
    });
});

app.get('/cc/:id', function (req, res) {
    // Find creditcard by using id
    CC.findOne({_id: req.params.id}, function (err, cc) {

        // Had an error
        if(err) {
            console.error(err);
            res.sendStatus(500);
            return;
        }
        // Didn't find
        if(!cc) {
            res.sendStatus(404);
            return;
        }

        res.json(cc);
    });
});

app.listen(3000);