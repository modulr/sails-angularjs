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

      sails.models[model].update({id: id}, data).exec(function(err, response){
        if(err) return cb(err);

          sails.models.user.findOne({ id: comment.userId })
          .exec(function(err, user) {
            if(err) return cb(err);

            comment.user = user.toJSON();

            // sails.models[model].publishUpdate(id, {
            //   comment: comment
            // }, req );

            sails.sockets.broadcast(id, 'filesModule', { data: comment });

            res.json(comment);
          });

      });

    });


  }

};
