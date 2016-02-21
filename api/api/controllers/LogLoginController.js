/**
* LogLoginController
*
* @description :: Server-side logic for managing users
* @help        :: See http://links.sailsjs.org/docs/controllers
*/

module.exports = {

  charts: function(req, res, next)
  {
    var params = req.allParams();

    if (req.isSocket){
      sails.models.loglogin.watch(req);
    }

    sails.models.loglogin.find()
    .groupBy(params.id)
    .sum('count')
    .exec(function (err, data){
      if(err) return next(err);
      return res.json(200, { data: data });
    });
  },

  table: function(req, res, next)
  {
    if (req.isSocket){
      sails.models.loglogin.watch(req);
    }

    sails.models.loglogin.find()
    .sort('createdAt DESC')
    .limit(10)
    .populate('user')
    .exec(function (err, data){
      if(err) return next(err);
      return res.json(200, { data: data });
    });
  }

};
