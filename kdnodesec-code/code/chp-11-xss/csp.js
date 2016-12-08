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
var app = express();

var csp = require('helmet-csp');

app.use(csp({
    directives: {
        defaultSrc: ["'self'"]
    }
}));

app.get('/', function (req, res, next) {
    res.send('ok');
});

//app.listen(3000);
app.listen(8080, function () {
  console.log('Example app listening on port 8080!')
})