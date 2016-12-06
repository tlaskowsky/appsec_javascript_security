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
var easySession = require('easy-session');

// Our imaginary DB
var db = {
    users: {
        johann: { name: 'Johann', company: 'Mixo', age: 32, role: 'admin'},
        andris: { name: 'Andris', company: 'Apple', age: 22, role: 'manager'},
        brian: { name: 'Brian', company: 'Apple', age: 26, role: 'manager'},
        jake: { name: 'Jake', company: 'Shell', age: 53, role: 'reader'}
    }
};

var app = express();

var cookieParser = require('cookie-parser');
var session = require('express-session');
app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));
app.use(easySession.main(session, {
    rbac: {
        roles: {
            reader: {
                can: ['read posts']
            },
            manager: {
                can: ['reader', 'edit posts']
            },
            admin: {
                can: ['manager', 'read users']
            }
        }
    }
}));

app.get('/logout', function (req, res, next) {
    req.session.logout(function () {
        res.redirect('/');
    });
});

app.get('/login/:user', function (req, res, next) {
    if(!db.users[req.params.user]) {
        res.sendStatus(400);
        return;
    }
    req.session.login(db.users[req.params.user].role, function () {
        res.redirect('/');
    });
});

// Function to build menu
function getNav(req, cb) {
    var html = '<nav>' +
        '<a href="/page/1">Page 1</a> ' +
        '<a href="/page/2">Page 2</a> ' +
        '<a href="/page/3">Page 3</a> ';

    req.session.can('read users', function (err, can){
        if(!err && can) {
            html += '<a href="/users">Users</a>';
        }
        cb(null, html);
    });
}

// Show a welcome message
app.get('/', function (req, res, next) {
    getNav(req, function (err, html) {
        res.send(html + '<br/><div>Welcome home</div>');
    });
});

// Regular pages, show what page we are on
app.get('/page/:nr', function (req, res, next){
    getNav(req, function (err, html) {
        res.send(html + '<div>Page ' + req.params.nr +'</div>');
    });
});

// Our admin function to show users
app.get('/users', function (req, res, next) {
    getNav(req, function (err, html) {
        res.send(html + '<pre>' + JSON.stringify(db.users, '', 2) +'</pre>');
    });
});

app.listen(3000);