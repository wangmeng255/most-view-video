var express = require('express');
var app = new express();

app.use(express.static('build'));

app.listen(process.env.PORT, process.env.IP, function() {
    console.log('Listening to localhost: ', process.env.IP + ':' + process.env.PORT);
});