/*
var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello New York\n');
}).listen(3001);
console.log('Server running at http://localhost:3001/');
*/

var express = require('express');
var app = express();
require('./routes')(app);
app.listen(3001);

console.log("Innovate Flight Search on port 3001...");
