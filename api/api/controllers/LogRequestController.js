/**
* LogRequestController
*
* @description :: Server-side logic for managing users
* @help        :: See http://links.sailsjs.org/docs/controllers
*/

module.exports = {

  charts: function(req, res, cb)
  {
    var params = req.allParams();

    if (req.isSocket){
      sails.models.logrequest.watch(req);
    }

    sails.models.logrequest.find()
    .sum('count')
    .groupBy(params.id)
    .exec(function (err, logrequest){
      if(err) return cb(err);
      return res.json(logrequest);
    });
  },

  chartTime: function(req, res, cb)
  {
    var params = req.allParams();

    if (req.isSocket){
      sails.models.logrequest.watch(req);
    }

    var data = [];

    sails.models.logrequest.find()
    .min(params.id)
    .exec(function (err, min){
      if(err) return cb(err);
      data.push(min[0][params.id]);

      sails.models.logrequest.find()

      .average(params.id)
      .exec(function (err, average){
        if(err) return cb(err);
        data.push(average[0][params.id].toFixed(2));

        sails.models.logrequest.find()
        .max(params.id)
        .exec(function (err, max){
          if(err) return cb(err);
          data.push(max[0][params.id]);

          return res.json(data);
        });
      });

    });
  },

  table: function(req, res, cb)
  {
    if (req.isSocket){
      sails.models.logrequest.watch(req);
    }

    sails.models.logrequest.find({
      url: { '!': '/__getcookie' }
    })
    .limit(50)
    .populate('user')
    .sort('createdAt DESC')
    .exec(function (err, logrequest){
      if(err) return cb(err);
      return res.json(logrequest);
    });
  }

};
