/***
 * Excerpted from "Secure Your Node.js Web Application",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/kdnodesec for more book information.
***/
'use strict';

var db = require('../lib/db');
var crypt = require('../lib/crypt');

var schema = db.Schema({
    cc: {type: String, required: true}
});

// Define a pre save hook to encrypt
schema.pre('save', function (next) {
    // Encrypt the creditcard
    this.cc = crypt.encrypt(this.cc);
    next();
});

// Define a pre init hook to decrypt
schema.pre('init', function (next, data) {
    // Decrypt the credit card
    data.cc = crypt.decrypt(data.cc);
    next();
});

module.exports = db.model('CC', schema);