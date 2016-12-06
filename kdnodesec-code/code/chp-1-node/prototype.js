/***
 * Excerpted from "Secure Your Node.js Web Application",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/kdnodesec for more book information.
***/
'use strict';

function Person() {}                 // define the Person Class

Person.prototype.walk = function(){  // Modify the prototype
    console.log('I am walking!');
};
Person.prototype.sayHello = function(){
    console.log('hello');
};
// now every Person object will be able to invoke these functions

var person = new Person();
person.walk();                        // logs 'I am walking!'

var person2 = new Person();
person2.__proto__.walk = function () {
    console.log('I am walking fast');
};

person2.walk();  // logs 'I am walking fast'
person.walk();   // also logs 'I am walking fast' as we changed the prototype
