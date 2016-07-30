/**
* Folder.js
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
    url: {
      type: 'string'
    },
    owner: {
      model: 'user'
    },
    parentId: {
      type: 'string'
    },
    item: {
      type: 'string'
    },
    files: {
      collection:'file',
      via: 'folderId'
    },
    getStorage: function () {
      return '/storage'+ this.url;
    },
    toJSON: function() {
        var obj = this.toObject();
        obj.storage = this.getStorage();
        return obj;
    }
  }

});
