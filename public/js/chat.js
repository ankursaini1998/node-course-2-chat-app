var socket = io();

function scrollToBottom () {
  // Selectors
  var messages = jQuery('#messages');
  var newMessage = messages.children('li:last-child')
  // Heights
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
}

socket.on('connect',function (){
var params=jQuery.deparam(window.location.search);

socket.emit('join',params,function(err){
  if(err)
  {
    alert(err);
    window.location.href='/';
  }
  else {
    console.log('No error');
  }
})
//   socket.emit('createMsg',{
//     from: 'Server',
//     text : 'Hey , this is Andrew'
//   },function()
// {
//   console.log('Got it.....');
// });
 });
socket.on('disconnect',function (){
  console.log('Disconnected from server');
})

socket.on('updateUserList',function(users){
var ol=jQuery('<ol></ol>');
users.forEach(function(user){
  ol.append(jQuery('<li></li>').text(user));
})
jQuery('#users').html(ol);
  //console.log('Users list',users);
})

socket.on('newMsg',function(msg){
  // console.log('New Msg from server' , msg);
  var formattedTime = moment(msg.createdAt).format('h:mm a');
  var template=jQuery('#message-template').html();
  var html = Mustache.render(template,{
    text: msg.text,
    from: msg.from,
    createdAt : formattedTime
  })
  // var li=jQuery('<li></li>');
  // li.text(`${msg.from}   ${formattedTime}: ${msg.text}`);
  // jQuery('#messages').append(li);
  jQuery('#messages').append(html);
  scrollToBottom();
});

socket.on('newLocMsg',function (message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template=jQuery('#location-message-template').html();
  var html= Mustache.render(template,{
    from: message.from,
    createdAt : formattedTime,
    url : message.url
  })
  // var li=jQuery('<li></li>');
  // var a=jQuery('<a target="_blank"> My current location</a>');
  // li.text(`${message.from} ${formattedTime} :`);
  // a.attr('href',message.url);
  // li.append(a);
  jQuery('#messages').append(html);
  scrollToBottom();
})

jQuery('#message-form').on('submit',function(e){
  e.preventDefault();
  socket.emit('createMsg',{
  //  from: "User",
    text: jQuery('[name=message]').val()
  },function(){
  jQuery('[name=message]').val('');
  })
})

var locationbutton=jQuery('#location');
locationbutton.on('click',function(){
  if(!navigator.geolocation){
    return alert('Geolocation not supported by your browser');
    }
    locationbutton.attr('disabled','disabled').text('Sending location.....');
    navigator.geolocation.getCurrentPosition(function(position){
      locationbutton.removeAttr('disabled').text('Send location ');
    socket.emit('createlocation',{
      latitude :position.coords.latitude,
      longitude:position.coords.longitude
    }
,function(){
    locationbutton.removeAttr('disabled').text('Send location ');
  alert('Unable to fetch location');
});
})
});
