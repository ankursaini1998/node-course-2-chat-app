var socket = io();

socket.on('connect',function (){
  console.log("Connected to server");
  socket.emit('createMsg',{
    to: 'Server',
    text : 'Hey , this is Andrew'
  });
});
socket.on('disconnect',function (){
  console.log('Disconnected from server');
})

socket.on('newMsg',function(email){
  console.log('New Msg from server' , email);
})
