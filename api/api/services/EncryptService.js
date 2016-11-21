var bcrypt = require('bcrypt');

module.exports = {
  encrypt: function(value, cb){
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(value, salt, function(err, hash){
        if(err) return cb(err);
        cb(null, hash);
      });
    });
  },
  compare: function(password1, password2, cb){
    bcrypt.compare( password1, password2, function(err, valid){
      if(err) return cb(err);
      cb(null, valid);
    });
  }
};
