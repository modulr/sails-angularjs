/**
* LogLoginController
*
* @description :: Server-side logic for managing users
* @help        :: See http://links.sailsjs.org/docs/controllers
*/

module.exports = {

  charts: function(req, res, cb)
  {
    var params = req.allParams();

    if (req.isSocket){
      sails.models.loglogin.watch(req);
    }

    sails.models.loglogin.find()
    .groupBy(params.id)
    .sum('count')
    .exec(function (err, loglogin){
      if(err) return cb(err);
      return res.json(loglogin);
    });
  },

  table: function(req, res, cb)
  {
    if (req.isSocket){
      sails.models.loglogin.watch(req);
    }

    sails.models.loglogin.find()
    .sort('createdAt DESC')
    .limit(50)
    .populate('user')
    .exec(function (err, loglogin){
      if(err) return cb(err);
      return res.json(loglogin);
    });
  }

};
