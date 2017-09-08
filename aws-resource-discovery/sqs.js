"use strict";
var AWS = require('aws-sdk');



process.on('message', function(m) {
    if (m.cmd === 'listsqs') {
        console.log('hs: I was asked to find SQS in account ' + m.accountId + ' with IAM role ' + m.crossAccountRole + ' in region ' + m.region);

        var listParams = m.resourceParams;
        listParams.region = m.region;
        //  resourceParams.region = m.region;
        console.log("Using IAM Access: \n", listParams);


        var sqs = new AWS.SQS(listParams);

        var params = {};

        var listQueues = function() {
            return new Promise(function(resolve, reject) {
                    sqs.listQueues(params, function(err, data) {
                        if (err) {
                            console.log(err, err.stack);
                            reject(err);
                            process.exit();
                        } else resolve(data);
                    });
                })
                .then(function(data) {

                    if (data.QueueUrls) {
                        console.log("Success:", data);
                        process.send({ result: 'sqslist', data: data.QueueUrls, accountId: m.accountId, crossAccountRole: m.crossAccountRole, region: m.region, resourceParams: m.resourceParams });
                        return;
                    } else if (!data.QueueUrls) {
                        console.log("None Found:", 'No SQS Queues found in ' + m.region + ' under AWS Account ' + m.accountId + ' using IAM role ' + m.crossAccountRole);
                        return;
                    }

                })
                .catch(console.error);
        };

        listQueues();

    } else if (m.cmd === 'done') {
        console.log("Process Exit Called!");
        process.exit();



    } else if (m.cmd === 'getmetrics') {

        console.log('hs: I was asked to get metrics for SQS URL ' + m.queueUrl + ' in account ' + m.accountId + ' with IAM role ' + m.crossAccountRole + ' in region ' + m.region);
        var getParams = m.resourceParams;
        // rparams.region = m.region;
        console.log("Get Metrics using IAM Access: \n", getParams);
        var msqs = new AWS.SQS(getParams);

        var gparams = {
            QueueUrl: m.queueUrl,
            AttributeNames: ['All']

        };

        var getMetrics = function() {
            return new Promise(function(resolve, reject) {
                    msqs.getQueueAttributes(gparams, function(err, data) {
                        if (err) {
                            console.log(err, err.stack);
                            reject(err);
                            process.exit();
                        } else resolve(data);
                    });
                })
                .then(function(data) {

                    if (data) {
                        console.log("Success:", data);
                        process.send({ result: 'sqsMetrics', data: data });
                        return;
                    } else if (!data) {
                        console.log("None Found:", 'No SQS Queues found in ' + m.region + ' under AWS Account ' + m.accountId + ' using IAM role ' + m.crossAccountRole);
                        //process.send({ result: 'sqslist', data: 'No SQS Found' });
                        return;
                    }

                })
                .catch(console.error);
        };

        getMetrics();


    }




});