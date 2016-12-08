/**
 * TestGroupController
 *
 * @description :: Server-side logic for managing Places
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  findByTest: function(req, res, cb)
  {
    var testId = req.param('id');

    sails.models.testquestion.find({ testId: testId })
    .exec(function(err, questions){
      if(err) return cb(err);
      res.json(questions);
    });
  }

};
