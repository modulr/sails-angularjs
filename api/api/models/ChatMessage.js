/**
* Chat.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var _ = require('lodash');

module.exports = _.merge(_.cloneDeep(require('./base')), {

  attributes: {
    chatId: {
      model: 'chat'
    },
    from: {
      type: 'string',
      // model: 'user',
      // columnName: 'fromId',
      required: true
    },
    // { userId, read }
    to: {
      type: 'array',
      defaultsTo: []
    },
    msg: {
      type:'string',
      required:true
    },
    counter: {
      type: 'integer',
      defaultsTo: 1
    }
  }

});
