/***
 * Excerpted from "Secure Your Node.js Web Application",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/kdnodesec for more book information.
***/
'use strict';

var args = require('minimist')(process.argv);
var mongoose = require('mongoose');

if(!args.d) {
    console.log('This example requires the -d (mongoose db) command line variable');
    process.exit();
}

mongoose.connect(args.d);

module.exports = mongoose;