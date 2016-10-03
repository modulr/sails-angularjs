var express = require('express');

var app = express();

var port = 3000;

app.use(express.static(__dirname + '/public'));

app.get('*', function(req, res, next) {
  res.sendFile('index.html', { root: __dirname + '/public' });
});

app.listen(port, function(err) {
  if (err) return console.log(), process.exit(1);

  console.log('modulr app listen port ' + port);
});
