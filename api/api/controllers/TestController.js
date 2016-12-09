/**
 * TestsController
 *
 * @description :: Server-side logic for managing Places
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  findByGroup: function(req, res, cb)
  {
    var groupId = req.param('id');

    sails.models.test.find({ groupId: groupId })
    .exec(function(err, tests){
      if(err) return cb(err);
      res.json(tests);
    });
  }

};
