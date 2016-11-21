/**
* File.js
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
    file: {
      type: 'string'
    },
    size: {
      type: 'string'
    },
    type: {
      type: 'string'
    },
    owner: {
      model: 'user'
    },
    shared: {
      type: 'array',
      defaultsTo: []
    },
    comments: {
      type: 'array',
      defaultsTo: []
    },
    folderId: {
      model: 'folder'
    },
    getImage: function () {
      var image = false;
      var array = this.type.split("/");
      if (array[0] == 'image') {
        image = true;
      }
      return image;
    },
    toJSON: function() {
      var obj = this.toObject();
      obj.image = this.getImage();
      return obj;
    }
  }

});
