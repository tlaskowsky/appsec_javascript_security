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

var csp = require('helmet-csp');
app.use(csp({
    // Specify directives as normal
    directives: {
        defaultSrc: ["'self'", 'default.com'],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ['style.com'],
        imgSrc: ['img.com', 'data:'],
        sandbox: ['allow-forms', 'allow-scripts'],
        reportUri: '/report-violation',
    },

    // Set to an empty array to allow nothing through
    objectSrc: [],

    // Set to true if you only want browsers to report errors, not block them
    reportOnly: false,

    // Set to true if you want to blindly set all headers: Content-Security-Policy,
    // X-WebKit-CSP, and X-Content-Security-Policy.
    setAllHeaders: false,

    // Set to true if you want to disable CSP on Android.
    disableAndroid: false,

    // Set to true if you want to force buggy CSP in Safari 5.1 and below.
    safari5: false
}));

app.get('/', function (req, res, next) {
    res.send('ok');
});

//app.listen(3000);
app.listen(8080, function () {
  console.log('Example app listening on port 8080!')
})