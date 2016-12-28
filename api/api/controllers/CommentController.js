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

        // Se envian las notificaciones
        var text = comment.userId+ ' ha comentado el archivo ' +response[0].name;

        // Owner
        EmailService.sendSimple('notification', {
          to: response[0].owner,
          subject: text,
          data: {
            paragraph: text
          }
        }, req);

        // shared
        if (response[0].shared.length) {
          async.each(response[0].shared, function(user, callback) {
            // It send the mail
            EmailService.sendSimple('notification', {
              to: user,
              subject: text,
              data: {
                paragraph: text
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


  }

};
