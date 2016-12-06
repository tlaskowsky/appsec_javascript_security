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
var Sequelize = require('sequelize');
var args = require('minimist')(process.argv);

if(!args.u || !args.d || !args.p) {
    console.log('This example requires the ' +
    '-u (user), ' +
    '-d (mysql db) and ' +
    '-p (password) command line variables');

    process.exit();
}

// Define connection to DB
var sequelize = new Sequelize(args.d, args.u, args.p, {
    dialect: 'mysql',
    port:    3306
});

// Define user model
var User = sequelize.define('user', {
    company: Sequelize.STRING,
    username: Sequelize.STRING
});
var app = express();

app.get('/', function (req, res) {
    res.send('ok');
});

// Define a path where we can ask users by
// company name and optionally limit the response
app.get('/:company/:limit*?', function(req, res, next){

    console.log(req.params);
    User.findAll({
        where: {
            company: req.params.company
        },
        limit: req.params.limit || 0
    }).then(function(users) {
        res.send(JSON.stringify(users));
    }).catch(next);
});
// Set up the database
sequelize
    .authenticate()
    .then(function() {
        // Sync the models
        return sequelize.sync({ force: true });
    })
    .then(function () {
        // Push example data into the database
        return User.bulkCreate([
            { username: 'karl', company: 'nodeswat' },
            { username: 'harri', company: 'nodeswat' },
            { username: 'jaanus', company: 'nodeswat' },
            { username: 'jaak', company: 'mektro' }
        ]).then(function() {
            // We are set up so start listening
            app.listen(3000);
        });
    })
    .catch(function (err) {
        console.log('Unable to connect to the database:', err)
        process.exit();
    });
