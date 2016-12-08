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
    userId: {
      model: 'user'
    },
    testId: {
      model: 'test'
    },
    score: {
      type: 'string'
    },
    dateInit: {
      type: 'date'
    },
    dateFinish: {
      type: 'date'
    },
    results: {
      type: 'array'
    }
  }

});
