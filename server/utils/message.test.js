var expect = require('expect');

var {generateMessage,generateLocMessage}= require('./message');

describe('generateMessage',() =>
{
  it('should generate correct message object',()=>{
    var from='Admin';
    var text='Welcome to chat .....';
    var message=generateMessage(from,text);

    expect(typeof message.createdAt).toBe('number');
    expect(message).toMatchObject({from,text});


  })
})


describe('generateLocMessage',() =>
{
  it('should generate correct location object',()=>{
    var from='User';
    var latitude=1;
    var longitude=1;
    var url='https://www.google.com/maps?q=1,1';
    var message=generateLocMessage(from,latitude,longitude);

    expect(typeof message.createdAt).toBe('number');
    expect(message).toMatchObject({from,url});


  })
})
