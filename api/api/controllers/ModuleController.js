/**
* ModuleController
*
* @description :: Server-side logic for managing Modules
* @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
*/

module.exports = {

  all: function(req, res, cb)
  {
    sails.models.module.find({sort: 'order ASC'}).exec(function(err, modules){
      if(err) return cb(err);
      res.json(modules);
    });
  },

  nav: function(req, res, cb)
  {
    sails.models.module.find({where: {active: true}, sort: 'order ASC'}).exec(function(err, modules){
      if(err) return cb(err);
      res.json(modules);
    });
  },

  saveOrder: function(req, res, cb)
  {
    var data = req.body;
    var x = 0;
    async.each(data, function(module, callback) {
      x++;
      sails.models.module.update({ id: module.id }, {order:x} ).exec(function(err, update){
        if(err) return cb(err);
        callback();
      });

    }, function(err) {
      sails.models.module.find({sort: 'order ASC'}).exec(function(err, modules){
        if(err) return cb(err);
        res.json(modules);
      });
    });
  },

  update: function(req, res, cb)
  {
    var id = req.params.id;
    var data = req.body;

    sails.models.module.update({ id:id }, data ).exec(function(err, update){
      if(err) return cb(err);
      sails.models.module.find({sort: 'order ASC'}).exec(function(err, modules){
        if(err) return cb(err);
        res.json(modules);
      });
    });
  }

};
