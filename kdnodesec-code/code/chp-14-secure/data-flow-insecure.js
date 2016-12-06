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

var session = require('express-session');
var cookieParser = require('cookie-parser');
var easySession = require('easy-session');

app.use(cookieParser());
app.use(session({
    secret: 'this is a nice secret',
    resave: false,
    saveUninitialized: true
}));

// This is an insecure request
app.get('/session', function (req, res) {
    if(!req.session.nr || typeof req.session.nr !== 'number') {
        req.session.nr = 0;
    }
    req.session.nr++;
    res.send('Request nr: ' + req.session.nr);
});

// This is not an insecure request
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

var allowedFiles = [
    'index',
    'login',
    'static'
];
app.get('/:path', function (req, res) {
    // Validate that it is an expected path
    if(allowedFiles.indexOf(req.params.path) === -1) {
        res.send(404);
        return;
    }
    res.sendFile(req.params.path + '.html');
});

app.listen(3000);