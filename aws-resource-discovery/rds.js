"use strict";
var AWS = require('aws-sdk');

process.on('message', function(m) {
    if (m.cmd === 'rds') {
        console.log('hs: I was asked to find RDS in account ' + m.account + ' with IAM role ' + m.iamrole);
        process.send({ data: 'YES!' });
    } else if (m.cmd === 'done') {
        process.exit();
    }
});