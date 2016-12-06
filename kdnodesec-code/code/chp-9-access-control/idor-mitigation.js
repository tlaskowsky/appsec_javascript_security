/***
 * Excerpted from "Secure Your Node.js Web Application",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/kdnodesec for more book information.
***/
'use strict';

// IMPORTANT: Please note that passwords should not be in plaintext
// No matter what type of DB is in use
var db = {
    1:{
        username: 'johann',
        password: 'pw',
        name: 'Johann',
        company: 'Mixo',
        role: 'user',
        age: 32
    },
    2:{
        username: 'andris',
        password: 'pw2',
        name: 'Andris',
        company: 'Apple',
        role: 'user',
        age: 22
    },
    3:{
        username: 'brian',
        password: 'pw3',
        name: 'Brian',
        company: 'Apple',
        role: 'user',
        age: 26
    },
    4:{
        username: 'jake',
        password: 'pw4',
        name: 'Jake',
        company: 'Shell',
        role: 'user',
        age: 53
    },
    // Add admin
    5:{
        username: 'admin',
        password: 'pwa',
        name: 'Admin',
        company: 'Mine',
        role: 'admin',
        age: 23
    }
};

function matchUsernamePassword(username, password) {
    if(!username || !password) {
        return {success:false, error: 'Missing username or password'};
    }
    var userId;
    Object.keys(db).some(function (id) {
        if(db[id].username === username) {
            userId = id;
            return true;
        }
    });
    if(!userId || db[userId].password !== password) {
        return {success: false, error: 'Wrong username or password'};
    }
    return {success: true, userId: userId, role: db[userId].role};
}

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
            user: {
                can: [{
                    name: 'access user',
                    when: function (params, cb) {
                        setImmediate(cb, null, params.userId === params.id);
                    }
                }]
            },
            admin: {
                can: ['user', 'access user']
            }
        }
    }
}));

app.get('/', function(req, res){
    if(!req.session.isGuest()) { // if the user is logged in then redirect to their home
        res.redirect('/user/' + req.session.userId);
        return;
    }
    var form = '<form method="POST" action="/login">' +
        '<input type="text" name="username" placeholder="username" />' +
        '<input type="password" name="password" placeholder="password" />' +
        '<input type="submit" value="Login" />' +
        '</form>';
    if(req.session.error) { // If we had an error then show it
        form += '<div>' + req.session.error + '</div>';
    }
    req.session.error = null; // Delete error.
    res.send(form);
});

app.post('/login', function (req, res) {
    var valid = matchUsernamePassword(req.body.username, req.body.password);
    if(valid.success) { // Validation success. Create authorized session.
        req.session.login(valid.role, {userId: +valid.userId}, function () {
            res.redirect('/settings/' + valid.userId);
        });
    } else {
        req.session.error = valid.error;
        res.redirect('/');
    }
});

app.get('/logout', function (req, res) {
    req.session.logout(function () {
        res.redirect('/');
    });
});

// Middleware to validate that users are authenticated
app.all('*', function (req, res, next) {
    if(req.session.isGuest()) {
        res.sendStatus(401);
        return;
    }
    next();
});

app.get('/settings/:id*?', easySession.isLoggedIn(), function (req, res) {
    // If there is no GET parameter
    if(!req.params.id) {
        // Use session variable instead of a GET variable
        res.json(db[req.session.userId]);
        return;
    }
    // If we are accessing our own info or we are admin
    if(req.session.userId === +req.params.id ||
        db[req.session.userId].username === 'admin'){

        res.json(db[req.params.id]);
        return;
    }
    res.sendStatus(403); // forbidden
});


app.get('/settings2/:id*?', easySession.isLoggedIn(), function (req, res) {
    // If there is no GET parameter
    if(!req.params.id) {
        // Use session variable instead of a GET variable
        res.json(db[req.session.userId]);
        return;
    }
    var params = {
        userId: req.session.userId,
        id: +req.params.id
    };
    // Check access
    req.session.can('access user', params, function (err, has) {
        if(err || !has) {
            res.sendStatus(403);
            return;
        }
        res.json(db[req.params.id]);
    });
});

app.listen(3000);