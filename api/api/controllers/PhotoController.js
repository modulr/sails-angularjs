/**
* PhotoController
*
* @description :: Server-side logic for managing photos
* @help        :: See http://links.sailsjs.org/docs/controllers
*/

var lwip = require('lwip');
var path = require('path');
// var fs = require('fs');

module.exports = {

  upload: function  (req, res, cb) {

    var userId = req.param('id');
    var folder = sails.config.settings.STORAGE + '/users/' + userId;

    req.file('file').upload({
      dirname: path.resolve(folder)
    },function (err, files) {
      if (err) return cb(err);

      var array = files[0].fd.split("/");
      var name = array[array.length - 1];

      // Se ajusta el tamaño de la imagen
      lwip.open(files[0].fd, function(err, image){
        if(err) return cb(err);

        image.batch()
        .resize(160, 160)
        .writeFile(folder + '/' + name, function(err){
          if(err) return cb(err);
          // Se guarda el registro en el modelo photo y se actualiza el modelo user
          sails.models.photo.create({ name: name, filename: files[0].filename, user: userId }).exec(function(err, photo){
            if(err) return cb(err);
            // Se actualiza la photo de usuario
            sails.models.user.update({ id: userId }, { photo: name }).exec(function(err, update){
              if(err) return cb(err);
              res.json({avatar: update[0].getAvatar(), photo: photo});
            });
          });
        });

      });

    });
  },

  // show: function (req, res){
  //
  //   req.validate({
  //     photo_id: 'string',
  //     user_id: 'string'
  //   });
  //
  //   sails.models.photo.findOne(req.param('photo_id')).exec(function (err, photo){
  //     if (err) return res.negotiate(err);
  //
  //     var photoUrl = null;
  //
  //     if (!photo){
  //       photoUrl = sails.config.appPath + '/assets/images/profile-photo.jpg';
  //     }else{
  //       photoUrl = sails.config.appPath + '/.tmp/uploads/' + req.param('user_id') + '/photos/' + photo.photo;
  //     }
  //
  //     fs.createReadStream(photoUrl).pipe(res);
  //   });
  // }
};
