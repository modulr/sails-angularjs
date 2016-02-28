/**
* ConfirmEmail.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var _ = require('lodash');

module.exports = _.merge(_.cloneDeep(require('./base')), {

  attributes: {
    userId: {
      model: 'user'
    },
    token: {
      type: 'string'
    },
    toJSON: function() {
      var obj = this.toObject();
      delete obj.token;
      return obj;
    }
  }
  
});
