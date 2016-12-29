/**
 * CommentController
 *
 * @description :: Server-side logic for managing Comments
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var moment = require('moment');

module.exports = {

  create: function(req, res, cb)
  {
    var params = req.allParams();
    var model = params.model;
    var id = params.id;

    var comment = {
      comment: params.comment,
      createdAt: moment().format(),
      userId: params.userId
    };

    sails.models[model].findOne({id:id})
    .exec(function (err, response){
      if(err) return cb(err);

      var data = {
        comments: []
      };

      if (response.comments !== undefined && response.comments.length > 0) {
        data.comments = response.comments;
      }

      data.comments.push(comment);

      sails.models[model].update({id: id}, data)
      .exec(function(err, response){
        if(err) return cb(err);

        sails.models.user.findOne({id:comment.userId})
        .exec(function (err, user){
          if(err) return cb(err);

          // Se envian las notificaciones
          var text = null;
          if (model == 'folder') {
            text = user.fullName || user.username+ ' ha comentado la carpeta ' +response[0].name;
          } else if(model == 'file') {
            text = user.fullName || user.username+ ' ha comentado el archivo ' +response[0].name;
          }
          var subject = text;
          var paragraph = text;
          var paragraph2 = 'Comentario:';
          var paragraph3 = comment.comment;

          // Owner
          EmailService.sendSimple('notification', {
            to: response[0].owner,
            subject: subject,
            data: {
              paragraph: paragraph,
              paragraph2: paragraph2,
              paragraph3: paragraph3
            }
          }, req);

          // shared
          if (response[0].shared.length) {
            async.each(response[0].shared, function(user, callback) {
              // It send the mail
              EmailService.sendSimple('notification', {
                to: user,
                subject: subject,
                data: {
                  paragraph: paragraph,
                  paragraph2: paragraph2,
                  paragraph3: paragraph3
                }
              }, req);
              callback();
            }, function(err) {
              res.json(comment);
            });
          } else {
            res.json(comment);
          }

        });

      });

    });


  }

};
