/**
 * TestGroupController
 *
 * @description :: Server-side logic for managing Places
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  findAllTestGroup: function(req, res, cb)
  {
    sails.models.testgroup.find()
    .populate('tests').exec(function(err, testGroups){
      if(err) return cb(err);
      res.json(testGroups);
    });
  },

  findOneTestGroupWithTests: function(req, res, cb)
  {
    var id = req.param('id');

    sails.models.testgroup.findOne(id)
    .populate('tests').exec(function(err, testGroup){
      if(err) return cb(err);
      res.json(testGroup);
    });
  }

};
