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
    description: {
      type: 'string'
    },
    group: {
      model: 'testGroup'
    },
    order: {
      type: 'string'
    },
    active: {
      type: 'boolean',
      defaultsTo: true
    },
    dateActivate: {
      type: 'date'
    },
    dateDeactivate: {
      type: 'date'
    },
    permissions: {
      type: 'array'
    },
    questions: {
      type: 'array'
    }
  }

});
