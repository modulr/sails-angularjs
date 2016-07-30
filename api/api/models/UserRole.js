/**
* UserRole.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var _ = require('lodash');

module.exports = _.merge(_.cloneDeep(require('./base')), {

  attributes: {
    // Name of Role
    role: {
      type: 'string',
      unique: true,
      required: true
    },
    description: {
      type: 'text'
    },
    // Lock role
    lock: {
      type: 'boolean',
      defaultsTo: false
    },
    authorizations: {
      type: 'json',
      defaultsTo: {}
    },
    users: {
      collection: 'user',
      via: 'role'
    }
  }

});
