module.exports = {

  chatUserLogged: function(userId, status, req)
  {
    sails.models.user.update({ id: userId }, { logged: status }).exec(function(err, user){
      if(err) sails.log(err);

      //if (req.isSocket) {
      // Se avisa a todos los sockets que el usuario se ha conectado o desconectado
      sails.sockets.join(req.socket, 'user_logged');
      sails.sockets.blast('user_logged', user[0], req.socket);
      //}

    });
  },

  // getDefaultAuthorizations: function(cb)
  // {
  //     sails.models.module.find({ deletedAt: null }).exec(function(err, modules){
  //         if(err) return cb(err);
  //
  //         var authorizations = {};
  //
  //         modules.forEach(function(v, k){
  //             authorizations[v.title] = {access: false};
  //             if (v.title == 'dashboard') {
  //                 authorizations[v.title] = {access: true};
  //             }
  //             if (v.sections !== undefined) {
  //                 v.sections.forEach(function(va, ke){
  //                     authorizations[v.title][va.title] = {access: false, write: false};
  //                 });
  //             }
  //         });
  //
  //         return cb(authorizations);
  //     });
  // }

  // findUser: function(id, next){
  //   sails.models.user.findOne({ id: id }).exec(function(err, user){
  //     next(err,user);
  //   });
  // },

  // getChats: function(user, cb)
  // {
  //   if (user.chats.length) {
  //
  //     sails.models.chat.find(user.chats)
  //     .populate('messages', {sort: 'createdAt DESC'})
  //     .exec(function(err, chats) {
  //       if(err) return cb(err);
  //
  //       async.each(chats, function(chat, callback) {
  //
  //         // Se obtienen los mensajes no leidos
  //         chat.noRead = 0;
  //         chat.messages.forEach(function(message){
  //           if (message.from != user.id) {
  //             message.to.forEach(function(to){
  //               if (to.userId == user.id && !to.read) {
  //                 chat.noRead++;
  //               }
  //             });
  //           }
  //         });
  //
  //         // Se obtiene el profile de los participantes
  //         chat.participants.forEach(function(participantId){
  //
  //           if (participantId != user.id) {
  //             sails.models.user.findOne({ id: participantId })
  //             .populate('profile')
  //             .exec(function(err, participant) {
  //               if(err) return cb(err);
  //
  //               chat.to = participant.toJSON();
  //               callback();
  //             });
  //           }
  //
  //         });
  //       }, function(err){
  //         cb(err, chats);
  //       });
  //
  //     });
  //
  //     // async.each(user.chats, function(v, callback) {
  //     //
  //     //   sails.models.chat.findOne({ id: v.id })
  //     //   .populate('participants')
  //     //   .exec(function(err, chat) {
  //     //     if(err) return next(err);
  //     //
  //     //     chat.participants.forEach(function(va){
  //     //       if (va.id != userId) {
  //     //
  //     //         sails.models.user.findOne(va.id)
  //     //         .populate('profile')
  //     //         .exec(function(err, to) {
  //     //           if(err) return next(err);
  //     //
  //     //           chat.to = to;
  //     //           user.chatsP.push(chat);
  //     //           callback();
  //     //         });
  //     //       }
  //     //     });
  //     //
  //     //   });
  //     //
  //     // }, function(err){
  //     //     if( err ) console.log(err);
  //     //
  //     //     res.json(200, {user: user});
  //     // });
  //
  //   } else {
  //     cb(null, []);
  //   }

  // }

};
