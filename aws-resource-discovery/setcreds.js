"use strict";
var AWS = require('aws-sdk');




process.on('message', function(m) {


    if (m.cmd === 'done') {
        console.log("Process Exit Called!");
        process.exit();

    } else if (m.cmd === 'setcreds') {

        var stsParams = { RoleArn: '', RoleSessionName: 'lambda-sqs-dynamic-discovery' };
        var resourceParams = { region: '', accessKeyId: '', secretAccessKey: '', sessionToken: '' };
        var sts = new AWS.STS();
        // then set stsParams from an input or variables:
        stsParams.RoleArn = stsParams.RoleArn = 'arn:aws:iam::' + m.accountId + ':role/' + m.crossAccountRole;

        console.log(stsParams.RoleArn);
        console.log('hs: I was asked to set sqs creds ' + m.accountId + ' with IAM role ' + m.crossAccountRole);
        // assume role into cross-account and get credentials
        var setCreds = function() {
            return new Promise(function(resolve, reject) {
                    sts.assumeRole(stsParams, function(err, data) {
                        if (err) {
                            console.log(err, err.stack);
                            reject(err);
                            process.exit();
                        } else resolve(data.Credentials);
                    });
                })
                .then(function(creds) {
                    if (creds) {
                        resourceParams.accessKeyId = creds.AccessKeyId;
                        resourceParams.secretAccessKey = creds.SecretAccessKey;
                        resourceParams.sessionToken = creds.SessionToken;
                    }
                    process.send({ result: 'sqscredset', securityParams: resourceParams, accountId: m.accountId });
                    return;

                })
                .catch(console.error);

        };

        setCreds();
    }
});