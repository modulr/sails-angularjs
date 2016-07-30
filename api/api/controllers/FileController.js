/**
 * FileController
 *
 * @description :: Server-side logic for managing Files
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var path = require('path');

module.exports = {

  byFolder: function(req, res, cb) {

    var id = req.param('id');

    sails.models.file.find({folder:id})
    .exec(function(err, result){
      if(err) return cb(err);
      res.json(result);
    });

  },

  upload: function (req, res, cb) {

    var id = req.param('id');
    var data = req.body;

    var folder = sails.config.settings.STORAGE + data.url +'/'+ id;

    req.file('file').upload({
      // Save file into folder
      dirname: path.resolve(folder)

    },function (err, file) {
      if (err) return cb(err);
        // Create registry in DB
        sails.models.file.create({
          file: FileService.getRealFileName(file[0]),
          name: file[0].filename,
          size: FileService.getHumanFileSize(file[0].size),
          type: file[0].type,
          item: id,
          folderId: data.currentFolderId,
          owner: req.token.id
        }).exec(function(err, file){
          if(err) return cb(err);
          res.json(file);
        });

    });

  }

};
