/**
* LogRequest.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var _ = require('lodash');

module.exports = _.merge(_.cloneDeep(require('./base')), {

  attributes: {
    // Request IP address
    ip: {
      type: 'string'
    },
    // Request protocol
    protocol: {
      type: 'string'
    },
    // Request method
    method: {
      type: 'string',
      required: true
    },
    // Request URL
    url: {
      type: 'string',
      required: true
    },
    // Request headers
    headers: {
      type: 'json'
    },
    // Used parameters
    parameters: {
      type: 'json'
    },
    // Request body
    body: {
      type: 'json'
    },
    // Request query
    query: {
      type: 'json'
    },
    // Request response time
    responseTime: {
      type: 'integer'
    },
    // Middleware latency
    middlewareLatency: {
      type: 'integer'
    },
    // This is needed for login summary data, dummy but no other choice atm...
    count: {
      type: 'integer',
      defaultsTo: 1
    },

    // Below is all specification for relations to another models

    // User object
    user: {
      model: 'User',
      columnName: 'userId',
      required: true
    }
  }

});
