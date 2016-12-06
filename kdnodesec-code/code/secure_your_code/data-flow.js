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

function getRandomNumbers() {
    var randoms = [];
    for(var i = 0; i < 5; i++) {
        randoms.push(Math.random());
    }
    return randoms;
}

app.get('/', function (req, res) {
    res.json(getRandomNumbers());
});

var session = require('express-session');
var cookieParser = require('cookie-parser');
var easySession = require('easy-session');

app.use(cookieParser());
app.use(session({
    secret: 'this is a nice secret',
    resave: false,
    saveUninitialized: true
}));
app.use(easySession.main(session));

app.get('/login', function (req, res) {
    if(req.session.isLoggedIn()) {
        res.redirect('/');
        return;
    }
    res.send('<form></form>');
});

app.get('/:path', function (req, res) {
    res.sendFile(req.params.path + '.html');
});

app.get('/:path', function (req, res) {
    res.send('Pathname was ' + req.params.path);
});

app.listen(3000);