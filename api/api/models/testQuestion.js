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
    testId: {
      model: 'test'
    },
    type: {
      type: 'text'
    },
    possibleAnswers: {
      type: 'array'
    },
    answer: {
      type: 'text'
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
