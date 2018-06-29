const path=require('path');
const express=require('express');
const socketIO= require('socket.io');
const http = require('http');
const{Users}=require('./utils/users')

const{generateMessage,generateLocMessage}=require('./utils/message');
const publicPath = path.join(__dirname, '../public');
const {isRealString} = require('./utils/validation')
const port=process.env.PORT || 3000;
var app=express();
var server=http.createServer(app);
var io=socketIO(server);
var users= new Users();

app.use(express.static(publicPath));


io.on('connection',function(socket){
  console.log("New user connected");

  socket.on('join', (params, callback) => {
      if (!isRealString(params.name) || !isRealString(params.room)) {
        callback('Name and room name are required.');
      }
      socket.join(params.room);
      users.removeUser(socket.id);
      users.addUser(socket.id,params.name,params.room);

      io.to(params.room).emit('updateUserList',users.getUserList(params.room))
      socket.emit('newMsg',generateMessage('Admin','Welcome to chat .....'));

      socket.broadcast.to(params.room).emit('newMsg',generateMessage('Admin',`${params.name} has joined`));

      callback();
    });

  socket.on('createMsg',function(msg,callback){
var user=users.getUser(socket.id);
if(user&& isRealString(msg.text)){
  io.to(user.room).emit('newMsg',generateMessage(user.name,msg.text));
}
    //console.log('New Msg from client',msg);
    //io.emit('newMsg',generateMessage(,msg.text));
    callback();
  });

socket.on('createlocation',function(coords){
  //console.log('User sent location......');
  var user=users.getUser(socket.id);
  if(user){
  io.to(user.room).emit('newLocMsg',generateLocMessage(user.name,coords.latitude,coords.longitude));
}})
socket.on('disconnect',function(){
var user=users.removeUser(socket.id);
if(user)
{
  io.to(user.room).emit('updateUserList',users.getUserList(user.room));
  io.to(user.room).emit('newMsg',generateMessage('Admin',` ${user.name} has left`));
}

});
});
server.listen(port,function()
{
  console.log(`connected on port ${port}`);
});
