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

    sails.models.file.find({folderId:id})
    .exec(function(err, result){
      if(err) return cb(err);
      res.json(result);
    });

  },

  upload: function (req, res, cb) {

    var values = req.body;
    console.log(values);
    var data = req.allParams();
    console.log(data);

    var folder = sails.config.settings.STORAGE + data.url +'/'+ data.item;

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
          item: data.item,
          folderId: data.currentFolderId,
          owner: req.token.id
        }).exec(function(err, file){
          if(err) return cb(err);
          res.json(file);
        });

    });

  }

};
