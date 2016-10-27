/**
 * FolderController
 *
 * @description :: Server-side logic for managing Folders
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  create: function(req, res, cb)
  {
    var data = req.body;

    data.createdUser = req.token.id;
    data.updatedUser = req.token.id;

    sails.models.folder.create(data).exec(function(err, folder){
      if(err) return cb(err);

      sails.models.folder.findOne({ id: folder.id })
      .populate('owner')
      .exec(function(err, folder) {
        if(err) return cb(err);

        res.json(folder);
      });

    });
  },

  findOne: function(req, res, cb)
  {
    var id = req.param('id');

    sails.models.folder.findOne({id:id})
    .populate('owner')
    .populate('createdUser')
    .populate('updatedUser')
    .exec(function(err, folder){
      if(err) return cb(err);

      async.parallel([
        function(callback){
          if (folder.shared !== undefined && folder.shared.length > 0) {
            var shared = [];
            async.each(folder.shared, function(val, callback) {
              sails.models.user.findOne({ id: val })
              .exec(function(err, user) {
                if(err) return cb(err);
                shared.push(user.toJSON());
                callback();
              });
            }, callback);
            folder.shared = shared;
          } else {
            folder.shared = [];
            callback();
          }
        },
        function(callback){
          if (folder.comments !== undefined && folder.comments.length > 0) {
            async.each(folder.comments, function(val, callback) {
              sails.models.user.findOne({ id: val.userId })
              .exec(function(err, user) {
                if(err) return cb(err);
                val.user = user.toJSON();
                callback();
              });
            }, callback);
            folder.comments.reverse();
          } else {
            folder.comments = [];
            callback();
          }
        }
      ],
      function(err){
        res.json(folder);
      });

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

      sails.models.folder.find({
        parentId: id,
        or : [
          { owner: req.token.id },
          { shared: { contains: req.token.id } }
        ]
      })
      .populate('createdUser')
      .populate('updatedUser')
      .populate('owner')
      .exec(function(err, result){
        if(err) return cb(err);

        response.children = result;

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
    .exec(function(err, result){
      if(err) return cb(err);

      var response = result;

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
      .exec(function(err, result){
        if(err) return cb(err);

        response = response.concat(result);

        res.json(response);
      });

    });

  }

};
