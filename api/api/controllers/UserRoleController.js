/**
 * UserRoleController
 *
 * @description :: Server-side logic for managing userroles
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  update: function(req, res, cb) {
    var id = req.params.id;
    var data = req.body;

    sails.models.userrole.update({id: id}, data).exec(function(err, update){
      if(err) return cb(err);

      var modules = [];

      async.each(data.authorizations, function(v, callback) {

        sails.models.module.update({ id: v.id }, v ).exec(function (err, module){
          if(err) return cb(err);

          modules.push(module[0]);
          callback();
        });

      }, function(err) {
        sails.models.userrole.findOne({id: update[0].id}).populate('users').exec(function(err, role){
          if(err) return cb(err);
          res.json({role: role, modules: modules});
        });
      });

    });
  }

};
