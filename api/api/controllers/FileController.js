/**
 * FileController
 *
 * @description :: Server-side logic for managing Files
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var path = require('path');

module.exports = {

  findOne: function(req, res, cb)
  {
    var id = req.param('id');

    sails.models.file.findOne({ id: id })
    .populate('owner')
    .populate('createdUser')
    .populate('updatedUser')
    .exec(function(err, file){
      if(err) return cb(err);

      async.parallel([
        function(callback){
          if (file.shared !== undefined && file.shared.length > 0) {
            var shared = [];
            async.each(file.shared, function(val, callback) {
              sails.models.user.findOne({ id: val })
              .exec(function(err, user) {
                if(err) return cb(err);
                shared.push(user.toJSON());
                callback();
              });
            }, callback);
            file.shared = shared;
          } else {
            file.shared = [];
            callback();
          }
        },
        function(callback){
          if (file.comments !== undefined && file.comments.length > 0) {
            async.each(file.comments, function(val, callback) {
              sails.models.user.findOne({ id: val.userId })
              .exec(function(err, user) {
                if(err) return cb(err);
                val.user = user.toJSON();
                callback();
              });
            }, callback);
            file.comments.reverse();
          } else {
            file.comments = [];
            callback();
          }
        }
      ],
      function(err){
        res.json(file);
      });

    });

  },

  uploadInFolder: function (req, res, cb)
  {
    var folderId = req.param('id');
    var folder = sails.config.settings.STORAGE +'/files/'+ folderId;

    req.file('file').upload({
      // Save file into folder
      dirname: path.resolve(folder),
      // adapter: require('skipper-s3'),
      // key: sails.config.settings.AWS_S3_KEY,
      // secret: sails.config.settings.AWS_S3_SECRET,
      // bucket: sails.config.settings.AWS_S3_BUCKETNAME

    },function (err, file) {
      if (err) return cb(err);

      // Create registry in DB
      sails.models.file.create({
        file: FileService.getRealFileName(file[0]),
        name: file[0].filename,
        size: FileService.getHumanFileSize(file[0].size),
        type: file[0].type,
        folderId: folderId,
        owner: req.token.id,
        createdUser: req.token.id,
        updatedUser: req.token.id
      }).exec(function(err, file){
        if(err) return cb(err);

        sails.models.file.findOne({ id: file.id })
        .populate('owner')
        .exec(function(err, file) {
          if(err) return cb(err);

          res.json(file);
        });
        
      });

    });

  }

};
