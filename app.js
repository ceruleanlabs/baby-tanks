var express = require('express');
var port = Number(process.env.PORT || 3000);
var app = express();

// app.use('/', express.static(__dirname + '/dist'));
app.get('/', function(req, res) {
  res.send('Heroku, this better fucking work.');
});

app.listen(port, function() {
  console.log("Listening on " + port);
});
