"use strict";
var fork = require('child_process').fork;
require('dotenv').config();



console.log(process.env.DB_HOST);


var child = fork(__dirname + '/aws-resource-discovery/sqs.js');

child.on('message', function(m) {
    console.log('The result is: ', m.data);
    child.send({ cmd: 'done' });
});


child.send({ cmd: 'sqs', account: 23432423, iamrole: 'cross-account-role' });