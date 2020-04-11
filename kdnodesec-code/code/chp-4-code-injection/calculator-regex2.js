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

app.get('/', function(req, res){
    var form = '' +
        '<form method="POST" action="/calc">' +
        '<input type="text" name="formula" placeholder="formula" />' +
        '<input type="submit" value="Calculate" />' +
        '</form>';
    res.send(form);
});

app.use(bodyParser.urlencoded({extended: false}));

app.post('/calc', function (req, res) {
    var formula = req.body.formula || '';

    // Remove everything besides 0-9 - * + /
    var cleanFormula = formula.replace(/[^0-9\-\/\*\+]/g, '');
    if(cleanFormula.length < 1) {
        res.status(400).send('Invalid input');
        return;
    }

    var result;
    // Surround with try-catch in case still invalid formula.
    try {
        eval('result = ' + cleanFormula);
    } catch(e) {
        res.status(400).send('Invalid input');
        return;
    }
    // Say what we calculated
    res.send('The result of ' + cleanFormula + ' is: ' + result);
});

//app.listen(3000);
app.listen(8080, function () {
  console.log('Example app listening on port 8080!')
});