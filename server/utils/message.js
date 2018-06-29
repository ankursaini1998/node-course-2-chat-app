var moment=require('moment');

var generateMessage =function (from,text)
{
  return {
    from,
    text,
    createdAt : moment().valueOf()
  }
}

var generateLocMessage=function(from,latitude,longitude)
{
  return{
    from,
    url: `https://www.google.com/maps?q=${latitude},${longitude}`,
    createdAt : moment().valueOf()

  }
}
//console.log(generateMessage('sdgks','gege'));
module.exports={generateMessage,generateLocMessage};
