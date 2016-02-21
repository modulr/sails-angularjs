var bcrypt = require('bcrypt');

module.exports = {
  encrypt: function(value, next){
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(value, salt, function(err, hash){
        if(err) return next(err);
        next(null, hash);
      });
    });
  },
  compare: function(password1, password2, next){
    bcrypt.compare( password1, password2, function(err, valid){
      if(err) return next(err);
      next(null, valid);
    });
  }
};
