"use strict";
var fork = require('child_process').fork;
require('dotenv').config();
var AWS = require('aws-sdk');
//AWS.config.update({ region: 'us-west-2' });

var setcreds = fork(__dirname + '/aws-resource-discovery/setcreds.js');
var sqs = fork(__dirname + '/aws-resource-discovery/sqs.js');
//var rds = fork(__dirname + '/aws-resource-discovery/rds.js');
var regions = ["us-west-2", "us-west-1", "us-east-1", "us-east-2"];
var accounts = JSON.parse(process.env.accountnumbers);


var metricscount = 0;
var sqslistcount = 0;
var accountscount = 0;

sqs.on('message', function(m) {
    if (m.result === 'sqslist') {
        console.log('The result is: ', m.data);
        sqslistcount = (sqslistcount + m.data.length);

        for (var i = 0, len = m.data.length; i < len; i++) {

            sqs.send({ cmd: 'getmetrics', crossAccountRole: m.crossAccountRole, queueUrl: m.data[i], accountId: m.accountId, region: m.region, resourceParams: m.resourceParams });
        }
    }

    if (m.result === 'sqsMetrics') {
        //console.log(m.data);
        metricscount = (metricscount + 1);

        if (metricscount === sqslistcount) {
            sqs.send({ cmd: 'done' });
        }
    }

});




sqs.on('exit', function(m) {
    console.log('SQS List/Metrics Parent Exiting!');
});


setcreds.on('message', function(m) {
    if (m.result === 'sqscredset') {
        console.log('The result is: \n', m.securityParams);
        accountscount = (accountscount + 1);

        for (var i = 0, len = regions.length; i < len; i++) {

            sqs.send({ cmd: 'listsqs', accountId: m.accountId, crossAccountRole: 'cross-account-access', region: regions[i], resourceParams: m.securityParams });

        }
        if (accountscount === accounts.length) { setcreds.send({ cmd: 'done' }); }
    }
});

setcreds.on('exit', function(m) {
    console.log('SetCreds Parent Exiting!');
});

/* rds.on('message', function(m) {
    console.log('The result is: ', m.data);
    rds.send({ cmd: 'done' });
}); */
for (var j = 0, len = accounts.length; j < len; j++) {
    setcreds.send({ cmd: 'setcreds', accountId: accounts[j], crossAccountRole: 'cross-account-access' });
}