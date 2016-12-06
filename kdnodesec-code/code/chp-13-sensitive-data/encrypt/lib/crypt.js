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
var crypto = require('crypto');

if(!args.k) {
    console.log('This example requires the -k (key) command line variable');
    process.exit();
}

var masterKey = args.k;   // Get master key from command line 

// A function to perform encryption
function encrypt(data) {
    // Create cipher and encrypt value
    var enc = crypto.createCipher('aes192', masterKey);
    enc.end(data);
    var encrypted = enc.read(); // Read the buffer

    // We will store the data in base64 format, because utf8 will
    // cause problems - the various characters in utf8 can break or be
    // lost in the storage/retrieval process
    return encrypted.toString('base64');
}

// A function to perform decryption
function decrypt(data) {
    // Create decipher
    var dec = crypto.createDecipher('aes192', masterKey);

    // Create buffer from encrypted value and decrypt
    var encrypted = new Buffer(data, 'base64');
    dec.end(encrypted);

    // Read data and convert back to utf8
    return dec.read().toString('utf8');
}

module.exports.encrypt = encrypt;
module.exports.decrypt = decrypt;
