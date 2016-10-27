/**
 * CommentController
 *
 * @description :: Server-side logic for managing Comments
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  create: function(req, res, cb)
  {
    var model = req.params.model;
    var id = req.params.id;
    var comment = req.body;

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
            res.json(comment);
          });

      });

    });


  }

};
