module.exports = {

  find: function(req, res, cb)
  {
    sails.models.hello.find().exec(function(err, greeting){
      if(err) return cb(err);
      res.json(greeting);
    });
  }

};
