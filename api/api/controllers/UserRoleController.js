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

    sails.models.userrole.update({id: id}, data).exec(function(err, role){
      if(err) return cb(err);

      res.json(role[0]);
    });
  }

};
