/***
 * Excerpted from "Secure Your Node.js Web Application",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/kdnodesec for more book information.
***/
'use strict';

// Our imaginary DB
var db = {
    users: {
        admin: { name: 'Admin', company: 'This', isAdmin: 1}
    }
};

var cookieParser = require('cookie-parser');
var easySession = require('easy-session');
var session = require('express-session');
var bodyParser = require('body-parser');
var express = require('express');
var app = express();

app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(easySession.main(session, {
    rbac: {
        roles: {
            reader: {
                can: ['read posts']
            },
            manager: {
                can: ['reader']
            },
            admin: {
                can: ['manager', 'add admins']
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

// Show a welcome message
app.get('/', function (req, res, next) {
    res.send('<h1>Welcome</h1><a href="/register">Register</a>');
});

// Show registration form
app.get('/register', function (req, res, next) {
    var form = '<form method="POST">' +
        '<input type="text" name="username" placeholder="username" />' +
        '<input type="text" name="name" placeholder="name" />' +
        '<input type="text" name="company" placeholder="company" />';

    // If has rights then show admin checkbox
    req.session.can('add admins', function (err, has) {
        if(!err && has) {
            form += '<label for="isAdmin">Is Admin? ' +
            '<input id="isAdmin" type="checkbox" name="isAdmin" value="1" />' +
            '</label>';
        }
        form += '<input type="submit" value="Submit" />' +
        '</form>';

        res.send(form);
    });

});
// Post request handler
app.post('/register', function (req, res, next){
    // Check username
    if(db.users[req.body.username]) {
        res.sendStatus(409);
        return;
    }

    var newUser = {
        name: req.body.name,
        company: req.body.company,
        isAdmin: req.body.isAdmin || 0 // if no isAdmin is sent then set to 0
    };
    db.users[req.body.username] = newUser;

    console.log(db.users); // show us the users
    res.redirect('/');
});

app.listen(3000);