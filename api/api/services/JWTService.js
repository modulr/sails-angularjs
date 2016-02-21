var jwt = require('jsonwebtoken');

module.exports = {
  issue: function(payload, expires){
    return jwt.sign({ id: payload }, sails.config.settings.TOKEN_SECRET, { expiresInMinutes: expires });
  },
  verify: function(token, verified){
    return jwt.verify(token, sails.config.settings.TOKEN_SECRET || 'shhhhh', {}, verified);
  }
};
