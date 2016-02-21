module.exports = {


  messages: function(req, res, cb)
  {
    var chatId = req.param('id');
    var userId = req.param('userId');
    var noRead = req.param('noRead');
    var limit = 15 + Number(noRead);

    //if (req.isSocket){
      sails.models.chatmessage.find({ chatId: chatId })
      .sort('createdAt DESC')
      .limit(limit)
      .exec(function(err, messages){
        if(err) cb(err);
          res.json({ data: messages });
      });
    //}
  },

  moreMessages: function(req, res, cb)
  {
    var chatId = req.param('id');
    var skip = req.param('skip');

    sails.models.chatmessage
    .find({ where: { chatId: chatId }, limit: 15, skip: skip })
    .sort('createdAt DESC')
    .exec(function(err, messages){
      if(err) cb(err);
      res.json({ data: messages });
    });
  },

  create: function(req, res, cb)
  {
    var newMessage = req.query;

    if (newMessage.to.isArray) {
      newMessage.to.forEach(function(v,k){
        newMessage.to[k] = JSON.parse(v);
      });
    } else {
      newMessage.to = [JSON.parse(newMessage.to)];
    }

    sails.models.chatmessage.create(newMessage)
    .exec(function(err, message){
      if(err) cb(err);

      sails.sockets.broadcast(message.to[0].userId, 'privateMessage', { data: message });

      res.json({ data: message });
    });
  },

  markRead: function(req, res, cb)
  {
    var chatId = req.param('id');
    var userId = req.param('userId');

    sails.models.chatmessage.find([{ chatId: chatId, 'to.userId': userId, 'to.read': false }])
    .exec(function(err, messages){

      async.each(messages, function(v, callback) {

        v.to[0].read = true;

        sails.models.chatmessage.update({id: v.id}, {'to': v.to})
        .exec(function(err, message){

          callback();
        });

      }, function(err) {
        res.json({ data: messages });
      });

    });

  }

};
