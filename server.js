"use strict";

var express = require('express');
let app = new express();

app.use(express.static('build'));

app.get('/search*', function(req, res) {
    res.sendFile(__dirname + '/build/index.html');
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log('Listening to localhost: ', process.env.IP + ':' + process.env.PORT);
});