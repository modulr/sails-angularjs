/**
 * FolderController
 *
 * @description :: Server-side logic for managing Folders
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  getFolderAndFiles: function(req, res, cb) {

    var id = req.param('id');

    sails.models.folder.findOne({id:id})
    .exec(function(err, result){
      if(err) return cb(err);

      var response = {
        folder: result,
        children: []
      };

      sails.models.folder.find({parentId:id})
      .populate('createdUser')
      .populate('updatedUser')
      .populate('owner')
      .exec(function(err, result){
        if(err) return cb(err);

        response.children = result;

        sails.models.file.find({folderId:id})
        .populate('createdUser')
        .populate('updatedUser')
        .populate('owner')
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

  getFolderAndFilesByParent: function(req, res, cb) {

    var id = req.param('id');

    sails.models.folder.find({parentId:id})
    .populate('createdUser')
    .populate('updatedUser')
    .populate('owner')
    .exec(function(err, result){
      if(err) return cb(err);

      var response = result;

      sails.models.file.find({folderId:id})
      .populate('createdUser')
      .populate('updatedUser')
      .populate('owner')
      .exec(function(err, result){
        if(err) return cb(err);

        response = response.concat(result);

        res.json(response);
      });

    });

  }

};
