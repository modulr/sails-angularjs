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
    test: {
      model: 'test'
    },
    type: {
      type: 'text'
    },
    order: {
      type: 'string'
    },
    active: {
      type: 'boolean',
      defaultsTo: true
    },
    possibleAnswers: {
      type: 'array'
    },
    correctAnswers: {
      type: 'text'
    },
    dateDeactivate: {
      type: 'date'
    },
    permissions: {
      type: 'array'
    }
  }

});
