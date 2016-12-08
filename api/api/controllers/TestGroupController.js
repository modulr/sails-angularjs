/**
 * TestGroupController
 *
 * @description :: Server-side logic for managing Places
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  findTestGroup: function(req, res, cb)
  {
    sails.models.testgroup.find()
    .populate('tests').exec(function(err, testGroups){
      if(err) return cb(err);
      res.json(testGroups);
    });
  }

};
