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
var mongoose = require('mongoose');

/* modified for c9.io exercise
var args = require('minimist')(process.argv);

if(!args.d) {
    console.log('This example requires the -d (mongoose db) command line variable');
    process.exit();
}
*/

// Connect to mongoose db
//mongoose.connect(args.d);
mongoose.connect('mongodb://127.0.0.1/itest');
mongoose.connection.on('error', function (err) {
    console.error('connection error:' + err);
    process.exit();
});

// Define user model
var userSchema = new mongoose.Schema({
    username:  { type: String, required: true, index: { unique: true } },
    company: { type: String, required: true },
    age: { type: Number, required: true}
});
var User = mongoose.model('User', userSchema);

User.remove().exec(); // Delete all previous Users.

var app = express();

app.get('/', function(req, res){
    res.send('ok');
});

app.get('/:age', function (req, res, next) {
    // Lets implement a completely unvalidated way to query the documents
    User.find({ $where: 'this.age < ' + req.params.age }, function (err, users) {
        if(err) {
            next(err);
            return;
        }
        res.send(JSON.stringify(users));
    });
});
// Fill database
User.create([
    { username: 'karl', company: 'nodeswat', age: 25 },
    { username: 'harri', company: 'nodeswat', age: 35 },
    { username: 'jaanus', company: 'nodeswat', age: 45 },
    { username: 'jaak', company: 'mektro', age: 55 }
], function (err) {
    if(err) {
        console.error(err);
        process.exit(1);
    }
    //console.log('Listening');
    //app.listen(3000);
    console.log('Listening to port 8080');
    app.listen(8080);
});