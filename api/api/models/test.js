/**
* Test.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var _ = require('lodash');

module.exports = _.merge(_.cloneDeep(require('./base')), {

  attributes: {
    name: {
      type: 'string'
    },
    group: {
      model: 'testGroup'
    },
    order: {
      type: 'string'
    },
    dateActivate: {
      type: 'date'
    },
    dateDeactivate: {
      type: 'date'
    },
    active: {
      type: 'boolean',
      defaultsTo: true
    },
    permissions: {
      type: 'array'
    }
  }

});
