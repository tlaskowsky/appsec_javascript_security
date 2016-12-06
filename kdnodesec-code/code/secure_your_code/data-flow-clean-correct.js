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
var mongoose = require('mongoose');
var express = require('express');
var args = require('minimist')(process.argv);

if(!args.d) {
    console.log('This example requires the -d (mongoose db) command line variable');
    process.exit();
}

// Connect to mongoose db
mongoose.connect(args.d);

var app = express();

app.use(bodyParser.urlencoded({extended: false}));

// Define user model
var userSchema = new mongoose.Schema({
    username:  { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true}, // this should be hashed
    role: {
        type: String,
        enum: ['guest', 'user', 'admin'],
        required: true,
        default: 'user'
    }
});

var User = mongoose.model('User', userSchema);

var allowed = [
    'username',
    'password'
];
app.post('/user', function (req, res) {
    var data = {};

    //Filter the input
    allowed.forEach(function (key) {
        data[key] = req.body[key];
    });

    User.create(data, function (err, user) {
        if(err) {
            console.log(err);
            res.send(500);
            return;
        }
        res.send(200);
    });
});

app.listen(3000);