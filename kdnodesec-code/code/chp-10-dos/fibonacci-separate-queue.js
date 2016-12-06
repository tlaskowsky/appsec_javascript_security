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
var cookieParser = require('cookie-parser');
var session = require('express-session');
var app = express();

// We need sessions if we are to track our users
// We could use tokens instead, but sessions are simpler for now
app.use(cookieParser());
app.use(session({
    secret: 'this is a nice secret',
    resave: false,
    saveUninitialized: true
}));

var vasync = require('vasync');
var exec = require('child_process').exec;

// Keep track of jobs and results
var currentRunning = null;
var runningJobs = [];
var unreadResults = {};

// Our calculation function
function fibonacci(obj, cb) {

    // Remove job from queue list
    runningJobs.splice(runningJobs.indexOf(obj.id), 1);
    currentRunning = obj.id;

    // Execute the separate calculation file
    exec('node ' + __dirname + '/fibonacci-calc.js ' + obj.nr,
        function (err, stdout, stderr) {
            //FIXME: We should use execFile
            //FIXME: We should handle possible errors here

            // Insert result to map and continue
            unreadResults[obj.id] = parseInt(stdout);
            currentRunning = false;
            cb();
        });
}

// Create our queue with concurrency 1
var queue = vasync.queuev({
    concurrency: 1,
    worker: fibonacci
});

app.get('/:n*?', function (req, res) {

    var jobId = req.session.jobId;
    if(jobId) {                            // Do we have a running job?
        var result = unreadResults[jobId];
        if(result) {                       // Do we have a result? If so:
            var jobNr = req.session.jobNr;
            delete unreadResults[jobId];   // Free memory

            req.session.jobId = null;
            req.session.jobNr = null;
                                          // Show result to customer
            res.send('Result for ' + jobNr + ' is ' + result);
        } else if(currentRunning === jobId) {
            res.send('Your job is running');
        } else {
            var jobInQueue = (runningJobs.indexOf(jobId) + 1);
            res.send('Your job is ' + jobInQueue + ' in the queue');
        }
        return;
    }

    if(!req.params.n) {
        res.send('Insert number parameter to path');
        return;
    }


    // Create id for the job and input for our function
    var input = {
        id: Math.random().toString(36).substr(2),
        nr: parseInt(req.params.n)
    };

    queue.push(input);               // Push job to queue
    runningJobs.push(input.id);

    req.session.jobId = input.id;    // Keep tracking info in session
    req.session.jobNr = input.nr;

    if(queue.length() === 0) {
        res.send('Your job is running');
    } else {
        var jobInQueue = (runningJobs.indexOf(jobId) + 1);
        res.send('Your job is ' + jobInQueue + ' in the queue');
    }

});

app.listen(3000);
