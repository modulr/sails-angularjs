var express = require('express');

var app = express();

app.use(express.static(__dirname + '/public'));

app.get('*', function(req, res, next) {
  res.sendFile('index.html', { root: __dirname + '/public' });
});

app.listen(3000, function(err) {
  if (err) return console.log(), process.exit(1);

  console.log('modulr app listen port 3000');
});
