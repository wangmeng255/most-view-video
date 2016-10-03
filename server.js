var express = require('express');
var app = new express();
var fs = require('fs');
var mustache = require('mustache'); // bring in mustache template engine

app.get('/', function(req, res) {
    var page = fs.readFileSync('index.mustache', "utf8");
    var html = mustache.to_html(page, {production:process.env.NODE_ENV == 'production'});
    res.end(html);
});

app.use(express.static('build'));

app.listen(process.env.PORT, process.env.IP, function() {
    console.log('Listening to localhost: ', process.env.IP + ':' + process.env.PORT);
});