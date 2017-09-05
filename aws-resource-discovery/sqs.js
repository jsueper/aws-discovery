"use strict";

process.on('message', function(m) {
    if (m.cmd === 'sqs') {
        console.log('hs: I was asked to find SQS in account ' + m.account + ' with IAM role ' + m.iamrole);
        process.send({ data: 'YES!' });
    } else if (m.cmd === 'done') {
        process.exit();
    }
});