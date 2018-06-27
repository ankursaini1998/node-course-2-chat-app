const path=require('path');
const express=require('express');
const socketIO= require('socket.io');
const http = require('http');

const publicPath = path.join(__dirname, '../public');
const port=process.env.PORT || 3000;
var app=express();
var server=http.createServer(app);
var io=socketIO(server);

app.use(express.static(publicPath));

io.on('connection',function(socket){
  console.log("New user connected");

  socket.emit('newMsg',{
    from : 'Server',
    text : 'Hey , whats going on..',
    createdAt : 123
  });

  socket.on('createMsg',function(msg){
    console.log('New Msg from client',msg);
  })

socket.on('disconnect',function(){
  console.log("user was disconnected");
});
});
server.listen(port,function()
{
  console.log(`connected on port ${port}`);
});
