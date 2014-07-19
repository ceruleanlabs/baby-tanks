var express = require('express');
process.env.PWD = process.cwd();
var port = Number(process.env.PORT || 3000);
var app = express();

app.use('/', express.static(process.env.PWD + '/dist'));

app.listen(port, function() {
  console.log("Listening on " + port);
});
