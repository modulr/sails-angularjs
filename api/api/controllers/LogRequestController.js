/**
* LogRequestController
*
* @description :: Server-side logic for managing users
* @help        :: See http://links.sailsjs.org/docs/controllers
*/

module.exports = {

  charts: function(req, res, next)
  {
    var params = req.allParams();

    if (req.isSocket){
      sails.models.logrequest.watch(req);
    }

    sails.models.logrequest.find()
    .groupBy(params.id)
    .sum('count')
    .exec(function (err, data){
      if(err) return next(err);
      return res.json(200, { data: data });
    });
  },

  chartTime: function(req, res, next)
  {
    var params = req.allParams();

    if (req.isSocket){
      sails.models.logrequest.watch(req);
    }

    var data = [];

    sails.models.logrequest.find()
    .min(params.id)
    .exec(function (err, min){
      if(err) return next(err);
      data.push(min[0][params.id]);

      sails.models.logrequest.find()

      .average(params.id)
      .exec(function (err, average){
        if(err) return next(err);
        data.push(average[0][params.id].toFixed(2));

        sails.models.logrequest.find()
        .max(params.id)
        .exec(function (err, max){
          if(err) return next(err);
          data.push(max[0][params.id]);

          return res.json(200, { data: data });
        });
      });

    });
  },

  table: function(req, res, next)
  {
    if (req.isSocket){
      sails.models.logrequest.watch(req);
    }

    sails.models.logrequest.find()
    .sort('createdAt DESC')
    .limit(10)
    .populate('user')
    .exec(function (err, data){
      if(err) return next(err);
      return res.json(200, { data: data });
    });
  }

};
