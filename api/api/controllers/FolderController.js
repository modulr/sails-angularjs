/**
 * FolderController
 *
 * @description :: Server-side logic for managing Folders
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var moment = require('moment');

module.exports = {

  findOne: function(req, res, cb) {
    var id = req.param('id');

    sails.models.folder.findOne({id:id})
    .populate('owner')
    .populate('createdUser')
    .populate('updatedUser')
    .then(function(folder){

      if (folder.comments.length > 0) {
        async.each(folder.comments, function(val, callback) {
          sails.models.user.findOne({ id: val.userId })
          .exec(function(err, user) {
            if(err) return cb(err);

            val.user = user.toJSON();
            callback();
          });
        }, function(err) {
          folder.comments.reverse();
          res.json(folder);
        });
      } else {
        res.json(folder);
      }

    })
    .catch(function(err){
      return cb(err);
    });

      // async.parallel([
      //   function(callback){
      //     if (folder.shared) {
      //       var shared = [];
      //       async.each(folder.shared, function(val, callback) {
      //         sails.models.user.findOne({ id: val })
      //         .exec(function(err, user) {
      //           if(err) return cb(err);
      //           shared.push(user.toJSON());
      //           callback();
      //         });
      //       }, callback);
      //       folder.shared = shared;
      //     } else {
      //       folder.shared = [];
      //       callback();
      //     }
      //   },
      //   function(callback){
      //     if (folder.comments) {
      //       async.each(folder.comments, function(val, callback) {
      //         sails.models.user.findOne({ id: val.userId })
      //         .exec(function(err, user) {
      //           if(err) return cb(err);
      //           val.user = user.toJSON();
      //           callback();
      //         });
      //       }, callback);
      //       folder.comments.reverse();
      //     } else {
      //       folder.comments = [];
      //       callback();
      //     }
      //   }
      // ],
      // function(err){
      //   res.json(folder);
      // });

  },

  create: function(req, res, cb) {
    var data = req.body;

    data.createdUser = req.token.id;
    data.updatedUser = req.token.id;

    // Search parentFolder and get shared users (heredity)
    sails.models.folder.findOne({ id: data.parentId })
    .then(function(parentFolder){
      data.shared = parentFolder.shared;
      return data;
    })
    .then(function(data){
      // Create folder
      return sails.models.folder.create(data)
      .then(function(folder){
        return folder;
      });
    })
    .then(function(folder){
      // Get folder with owner
      return sails.models.folder.findOne({id: folder.id}).populate('owner');
    })
    .then(function(folder){
      // Get folder with shared user
      if (folder.shared.length > 0) {
        return sails.models.user.find({ id: folder.shared })
        .then(function(users) {
          folder.shared = [];
          users.forEach(function(value){
            folder.shared.push(value.toJSON());
          });
          return folder;
        });
      }
      return folder;
    })
    .then(function(folder){
      res.json(folder);
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

    sails.models.folder.update({id: id}, data)
    .exec(function(err, folder){
      if(err) return cb(err);

      // If have change in shared
      if (data.shared) {

        // Se comparten tambien las carpetas padre para que el usuario pueda tener acceso a la carpeta
        sails.models.folder.findOne({ id: folder[0].parentId })
        .exec(function(err, folderParent){
          if(err) return cb(err);
          // If have parent folder
          if (folderParent.parentId) {
            // If not exist someone user in folder shared
            data.shared.forEach(function(index) {
              if (folderParent.shared.indexOf(index) < 0){
                folderParent.shared.push(index);
              }
            });
            // Change shared parent folder
            sails.models.folder.update({id: folderParent.id}, {shared:folderParent.shared})
            .exec(function(err, folder){
              if(err) return cb(err);

              res.ok();
            });
          }
        });

        // Se envian las notificaciones
        var text = null;
        if (data.action == 'added') {
          text = 'La carpeta ' +folder[0].name+ ' ahora se comparte con ' +data.user.fullName || data.user.username;
        } else if (data.action == 'removed') {
          text = 'La carpeta ' +folder[0].name+ ' se dejo de compartir con ' +data.user.fullName || data.user.username;
          // Removed
          req.setLocale(data.user.lang);
          EmailService.send('notification', {
            to: data.user.email,
            subject: 'Dejaron de compartirte la carpeta ' +folder[0].name,
            data: {
              hi: req.__('hi', data.user.fullName || data.user.username),
              paragraph: 'Dejaron de compartirte la carpeta ' +folder[0].name,
              team: req.__('team')
            }
          });
        }

        // Owner
        EmailService.sendSimple('notification', {
          to: folder[0].owner,
          subject: text,
          data: {
            paragraph: text
          }
        }, req);

        // shared
        async.each(data.sharedUsers, function(user, callback) {

          // It send the mail
          req.setLocale(user.lang);
          EmailService.send('notification', {
            to: user.email,
            subject: text,
            data: {
              hi: req.__('hi', user.fullName || user.username),
              paragraph: text,
              team: req.__('team')
            }
          });

          callback();

        }, function(err) {

          res.ok();
        });

      } else {
        res.ok();
      }

    });
  },

  getFolderAndFiles: function(req, res, cb) {

    var id = req.param('id');

    sails.models.folder.findOne({id:id})
    .exec(function(err, result){
      if(err) return cb(err);

      var response = {
        folder: result,
        children: []
      };

      // Search children
      async.parallel({
        folders: function(callback) {

          sails.models.folder.find({
            parentId:id,
            or : [
              { owner: req.token.id },
              { shared: { contains: req.token.id } }
            ]
          })
          .populate('createdUser')
          .populate('updatedUser')
          .populate('owner')
          .exec(function(err, folders){
            if(err) return cb(err);

            async.each(folders, function(folder, callback) {

              if (folder.shared.length > 0) {
                return sails.models.user.find({ id: folder.shared })
                .then(function(users) {
                  folder.shared = [];
                  users.forEach(function(user){
                    folder.shared.push(user.toJSON());
                  });
                  callback();
                });
              } else {
                callback();
              }

            }, function(err){
              callback(null, folders);
            });

          });

        },
        files: function(callback) {

          sails.models.file.find({
            folderId:id,
            or : [
              { owner: req.token.id },
              { shared: { contains: req.token.id } }
            ]
          })
          .populate('createdUser')
          .populate('updatedUser')
          .populate('owner')
          .exec(function(err, files){
            if(err) return cb(err);

            async.each(files, function(file, callback) {

              if (file.shared.length > 0) {
                return sails.models.user.find({ id: file.shared })
                .then(function(users) {
                  file.shared = [];
                  users.forEach(function(user){
                    file.shared.push(user.toJSON());
                  });
                  callback();
                });
              } else {
                callback();
              }

            }, function(err){
              callback(null, files);
            });

          });

        }
      }, function(err, results) {
        response.children = results.folders.concat(results.files);
        res.json(response);
      });

    });

  },

  getFolderAndFilesByParent: function(req, res, cb) {

    var id = req.param('id');

    async.parallel({
      folders: function(callback) {

        sails.models.folder.find({
          parentId:id,
          or : [
            { owner: req.token.id },
            { shared: { contains: req.token.id } }
          ]
        })
        .populate('createdUser')
        .populate('updatedUser')
        .populate('owner')
        .exec(function(err, folders){
          if(err) return cb(err);

          async.each(folders, function(folder, callback) {

            if (folder.shared.length > 0) {
              return sails.models.user.find({ id: folder.shared })
              .then(function(users) {
                folder.shared = [];
                users.forEach(function(user){
                  folder.shared.push(user.toJSON());
                });
                callback();
              });
            } else {
              callback();
            }

          }, function(err){
            callback(null, folders);
          });

        });

      },
      files: function(callback) {

        sails.models.file.find({
          folderId:id,
          or : [
            { owner: req.token.id },
            { shared: { contains: req.token.id } }
          ]
        })
        .populate('createdUser')
        .populate('updatedUser')
        .populate('owner')
        .exec(function(err, files){
          if(err) return cb(err);

          async.eachSeries(files, function(file, callback) {

            if (file.shared.length > 0) {
              return sails.models.user.find({ id: file.shared })
              .then(function(users) {
                file.shared = [];
                users.forEach(function(user){
                  file.shared.push(user.toJSON());
                });
                callback();
              });
            } else {
              callback();
            }

          }, function(err){
            callback(null, files);
          });

        });

      }
    }, function(err, results) {
      response = results.folders.concat(results.files);
      res.json(response);
    });

  }

};
