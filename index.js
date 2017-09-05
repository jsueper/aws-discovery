var fork = require('child_process').fork;

var child = fork(__dirname + '/sqs.js');

child.on('message', function(m) {
    console.log('The result is: ', m.data);
    child.send({ cmd: 'done' });
});


child.send({ cmd: 'sqs', account: 23432423 });