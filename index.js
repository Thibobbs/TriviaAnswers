// Init server
var express = require('express')
var app = express();
var http = require('http').Server(app);

// Init socket io
var io = require('socket.io')(http);

// Init body-parser
var bodyParser = require('body-parser');

// Import configs & app socket
import { config, appSocket, defineAppSocket } from './config';

// Import arrays gestion
import { arrays } from './src/arrays';

// Import search
import search from './src/search';

// Import search
import { allChoices, choiceUpdate } from './src/choices';

// Define app socket
defineAppSocket(io)

// Body-parser settings
app.use(bodyParser.json({limit: '50mb'}));

// Static website path
app.use(express.static(config.sitePath));

// Post route
app.post('/image', function(req, res){
  console.log("File uploaded");

  var img = {};
  img.file = req.body.image;
  img.fileName = "hq.png";
//  socket.emit('screenshot', img);

  arrays.reset()

  search(img)

  res.status(200).send("Image uploaded");
});

// Io events
io.on('connection', function (socket) {
  console.log('A new user is here !');

  io.emit('get choice', allChoices);

  socket.on('disconnect', function () {
    console.log('A user has left us...');
  });
  
  socket.on('screenshot', img => {
    search(img)
  });

  socket.on('set choice', choice =>{
    choiceUpdate(choice)
  });
});

// Start server
http.listen(process.env.PORT || config.port, function () {
  console.log(`listening on *:${(process.env.PORT || config.port)}`);
});
