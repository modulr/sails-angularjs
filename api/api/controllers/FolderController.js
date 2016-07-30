/**
 * FolderController
 *
 * @description :: Server-side logic for managing Folders
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  all: function(req, res, cb) {

    var id = req.param('id');
    var item = req.param('item');

    sails.models.folder.findOne({id:id})
    .exec(function(err, result){
      if(err) return cb(err);

      var response = {
        home: result,
        children: []
      };

      sails.models.folder.find({parentId:id, item:item})
      .exec(function(err, result){
        if(err) return cb(err);

        response.children = result;

        sails.models.file.find({folderId:id, item:item})
        .exec(function(err, result){
          if(err) return cb(err);

          if (response.children.length > 0) {
            response.children = response.children.concat(result);
          } else {
            response.children = result;
          }

          res.json(response);
        });

      });

    });

  },

  byParent: function(req, res, cb) {

    var id = req.param('id');

    sails.models.folder.find({parentId:id})
    .exec(function(err, result){
      if(err) return cb(err);

      var response = result;

      sails.models.file.find({folderId:id})
      .exec(function(err, result){
        if(err) return cb(err);

        response = response.concat(result);

        res.json(response);
      });

    });

  }

};
