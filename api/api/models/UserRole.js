/**
* UserRole.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var _ = require('lodash');

module.exports = _.merge(_.cloneDeep(require('./base')), {

  attributes: {
    role: {
      type: 'string',
      unique: true,
      required: true
    },
    description: {
      type: 'text'
    },
    lock: {
      type: 'boolean',
      defaultsTo: false
    },
    users: {
      collection: 'user',
      via: 'role'
    },
    permissions: {
      type: 'json',
      defaultsTo: {}
    }
  }

});
