module.exports = {

  chats: function(req, res, cb)
  {
    var userId = req.token.id;

    // Se busca el user que realizo la peticion
    sails.models.user.findOne({ id: userId })
    .populate('chats')
    .exec(function(err, user){
      if(err) cb(err);

      // Se obtienen los chats y se iteran
      var chats = user.chats;
      var notifications = 0;
      async.each(chats, function(v, callback) {
        // Se buscan el ultimo mensaje del chat y los participantes
        sails.models.chat.findOne({ id: v.id })
        .populate('messages', {sort: 'createdAt DESC', limit: 1})
        .populate('participants')
        .exec(function(err, chat){
          if(err) cb(err);

          v.lastMessages = [];
          // Se obtiene el ultimo mensaje del chat
          if (chat.messages.length) {
            v.lastMessages.push({
              id: chat.messages[0].id,
              from: chat.messages[0].from,
              msg: chat.messages[0].msg,
              createdAt: chat.messages[0].createdAt
            });

            v.noRead = 0;
            // Si el ultimo mensaje no ha sido leido se buscan todos de mensajes no leidos
            chat.messages[0].to.forEach(function(val){
              // Si el user que realizo la peticion no a leido el mensaje
              if (val.userId == userId && !val.read) {
                // Se buscan los mensajes no leidos
                sails.models.chatmessage
                .count({ chatId: v.id, sort: 'createdAt DESC', 'to.userId': userId, 'to.read': false })
                .exec(function(err, noRead) {
                  if(err) cb(err);
                  // Se obtiene el numero de mensajes no leidos
                  notifications++;
                  v.noRead = noRead;
                });
              }
            });
          }

          // Se iteran los participantes en el chat
          v.to = [];
          chat.participants.forEach(function(va){
            // Se busca el profile de los participantes exepto el del user que realizo la peticion
            if (va.id != user.id) {
              // Se busca el profile de los participantes
              sails.models.user.findOne({ id: va.id })
              .populate('profile')
              .exec(function(err, participant) {
                if(err) cb(err);

                // Se obtiene el profile y los datos del participante
                participant = participant.toJSON();

                v.to.push({
                  id: participant.id,
                  name: participant.profile.fullName || participant.username,
                  photo: participant.photo
                });

                callback();
              });
            }
          });
        });
      }, function(err) {
        // Se subscribe y se une al room creado con el userId
        sails.sockets.join(req.socket, userId);

        res.json({ data: chats, notifications: notifications });
      });

    });
  },

  chat: function (req, res, cb)
  {
    var chatId = req.param('id');
    var userId = req.token.id;

    // Se busca el chat, el ultimo mensaje y los participantes
    sails.models.chat.findOne({ id: chatId })
    .populate('messages', {sort: 'createdAt DESC', limit: 1})
    .populate('participants')
    .exec(function(err, chat){
      if(err) cb(err);

      var notifications = 0;

      chat.lastMessages = [];
      chat.noRead = 0;
      chat.to = [];

      // Si existe al menos un mensaje
      if (chat.messages.length) {
        // Se obtiene el ultimo mensaje del chat
        chat.lastMessages.push({
          id: chat.messages[0].id,
          from: chat.messages[0].from,
          msg: chat.messages[0].msg,
          createdAt: chat.messages[0].createdAt
        });
      }

      async.parallel([
        function(callback){

          // Se iteran los participantes en el chat
          chat.participants.forEach(function(val){
            // Se busca el profile de los participantes exepto el del user que realizo la peticion
            if (val.id != userId) {
              // Se busca el profile de los participantes
              sails.models.user.findOne({ id: val.id })
              .populate('profile')
              .exec(function(err, participant) {
                if(err) cb(err);

                // Se obtiene el profile y los datos del participante
                participant = participant.toJSON();

                chat.to.push({
                  id: participant.id,
                  name: participant.profile.fullName || participant.username,
                  photo: participant.photo
                });

                callback();
              });
            }

          });

        },
        function(callback){
          // Si existe al menos un mensaje
          if (chat.messages.length) {
            // Si el ultimo mensaje no ha sido leido se buscan todos de mensajes no leidos
            chat.messages[0].to.forEach(function(val){
              // Si el user que realizo la peticion no a leido el mensaje
              if (val.userId == userId && !val.read) {
                // Se buscan los mensajes no leidos
                sails.models.chatmessage
                .count({ chatId: chatId, sort: 'createdAt DESC', 'to.userId': userId, 'to.read': false })
                .exec(function(err, noRead) {
                  if(err) cb(err);
                  // Se obtiene el numero de mensajes no leidos
                  chat.noRead = noRead;
                  notifications++;

                  callback();
                });
              }
            });
          } else {
            callback();
          }

        }
      ],
      function(err){
        // Se subscribe y se une al room creado con el userId
        sails.sockets.join(req.socket, userId);

        res.json({ data: chat, notifications: notifications });
      });

    });


  },

  createPrivate: function (req, res, cb)
  {
    var participants = req.body;

    // Se crea el chat
    sails.models.chat.create()
    .exec(function(err, chat){
      if(err) cb(err);

      // Se agregan los participantes
      participants.forEach(function(userId){
        chat.participants.add(userId);
      });
      chat.save(function (err, result) {

        // Se iteran los participantes en el chat
        chat.to = [];
        async.each(result.participants, function(v, callback) {

          // Se busca el profile de los participantes exepto el del user que realizo la peticion
          if (v.id != participants[0]) {
            // Se busca el profile de los participantes
            sails.models.user.findOne({ id: v.id })
            .populate('profile')
            .exec(function(err, participant) {
              if(err) cb(err);

              // Se obtiene el profile y los datos del participante
              participant = participant.toJSON();

              chat.to.push({
                id: participant.id,
                name: participant.profile.fullName || participant.username,
                photo: participant.photo
              });

              callback();
            });
          } else {
            callback();
          }

        }, function(err){
          res.json({ data: chat });
        });

      });

    });
  }

};
