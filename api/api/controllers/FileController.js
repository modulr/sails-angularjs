/**
 * FileController
 *
 * @description :: Server-side logic for managing Files
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var path = require('path');
var moment = require('moment');

module.exports = {

  findOne: function(req, res, cb) {
    var id = req.param('id');

    sails.models.file.findOne({ id: id })
    .populate('owner')
    .populate('createdUser')
    .populate('updatedUser')
    .then(function(file){

      if (file.comments.length > 0) {
        async.each(file.comments, function(val, callback) {
          sails.models.user.findOne({ id: val.userId })
          .exec(function(err, user) {
            if(err) return cb(err);

            val.user = user.toJSON();
            callback();
          });
        }, function(err) {
          file.comments.reverse();
          res.json(file);
        });
      } else {
        res.json(file);
      }

    })
    .catch(function(err){
      return cb(err);
    });

  },

  update: function(req, res, cb) {
    var id = req.param('id');
    var data = req.body;

    data.updatedUser = req.token.id;
    data.updatedAt = moment().format();

    sails.models.file.update({id: id}, data)
    .exec(function(err, file){
      if(err) return cb(err);

      // If have change in shared
      if (data.shared) {
        sails.models.folder.findOne({ id: file[0].folderId })
        .exec(function(err, folder){
          if(err) return cb(err);

          if (folder.parentId) {
            // If not exist someone user in folder shared
            data.shared.forEach(function(index) {
              if (folder.shared.indexOf(index) < 0){
                folder.shared.push(index);
              }
            });

            // Change shared parent folder
            sails.models.folder.update({id: folder.id}, {shared:folder.shared})
            .exec(function(err, folder){
              if(err) return cb(err);

              res.ok();
            });
          }

        });
      } else {
        res.ok();
      }

    });
  },

  uploadInFolder: function (req, res, cb) {
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

      sails.models.folder.findOne({ id: folderId })
      .then(function(parentFolder){
        return parentFolder;
      })
      .then(function(parentFolder){
        // Create file
        return sails.models.file.create({
          file: FileService.getRealFileName(file[0]),
          name: file[0].filename,
          size: FileService.getHumanFileSize(file[0].size),
          type: file[0].type,
          folderId: folderId,
          shared: parentFolder.shared,
          owner: req.token.id,
          createdUser: req.token.id,
          updatedUser: req.token.id
        })
        .then(function(file){
          return file;
        });
      })
      .then(function(file){
        // Get file with owner
        return sails.models.file.findOne({id: file.id}).populate('owner');
      })
      .then(function(file){
        // Get file with shared user
        if (file.shared.length > 0) {
          return sails.models.user.find({ id: file.shared })
          .then(function(users) {
            file.shared = [];
            users.forEach(function(value){
              file.shared.push(value.toJSON());
            });
            return file;
          });
        }
        return file;
      })
      .then(function(file){
        res.json(file);
      })
      .catch(function(err){
        return cb(err);
      });

      // sails.models.folder.findOne({ id: folderId })
      // .exec(function(err, folder) {
      //   if(err) return cb(err);
      //
      //   // Create registry in DB
      //   sails.models.file.create({
      //     file: FileService.getRealFileName(file[0]),
      //     name: file[0].filename,
      //     size: FileService.getHumanFileSize(file[0].size),
      //     type: file[0].type,
      //     folderId: folderId,
      //     shared: folder.shared,
      //     owner: req.token.id,
      //     createdUser: req.token.id,
      //     updatedUser: req.token.id
      //   }).exec(function(err, file){
      //     if(err) return cb(err);
      //
      //     sails.models.file.findOne({ id: file.id })
      //     .populate('owner')
      //     .exec(function(err, file) {
      //       if(err) return cb(err);
      //
      //       if (file.shared > 0) {
      //         var shared = [];
      //         async.each(file.shared, function(val, callback) {
      //           sails.models.user.findOne({ id: val })
      //           .exec(function(err, user) {
      //             if(err) return cb(err);
      //             shared.push(user.toJSON());
      //             callback();
      //           });
      //         }, function(err) {
      //           file.shared = shared;
      //           res.json(file);
      //         });
      //       } else {
      //         res.json(file);
      //       }
      //
      //     });
      //
      //   });
      // });

    });

  }

};
