/**
* Company.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var _ = require('lodash');

module.exports = _.merge(_.cloneDeep(require('./base')), {

  attributes: {
    company: {
      type: 'string',
      unique: true,
      required: true
    },
    toJSON: function() {
      var obj = this.toObject();
      return obj;
    }
  }

});
