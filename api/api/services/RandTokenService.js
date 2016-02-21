var randtoken = require('rand-token');

module.exports = {
  generate: function(){
    return randtoken.generate(16);
  }
};
