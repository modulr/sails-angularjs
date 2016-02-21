/**
* Chat.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    name: {
      type:'string',
      defaultsTo: null
    },
    photo: {
      type:'string',
      defaultsTo: 'avatar.jpg'
    },
    // { 1: private, 2 group }
    type: {
      type: 'integer',
      defaultsTo: 1
    },
    messages: {
      collection: 'chatmessage',
      via: 'chatId'
    },
    // participants: {
    //   type: 'array',
    //   defaultsTo: []
    // }
    participants: {
      collection: 'user',
      via: 'chats'
    },
    getAvatar: function () {
      var avatar = null;
      if (this.photo == 'avatar.jpg') {
        avatar = 'images/' + this.photo;
      } else {
        avatar = 'storage/users/' + this.id + '/' + this.photo;
      }
      return avatar;
    },
    toJSON: function() {
      var obj = this.toObject();
      delete obj.password;
      obj.avatar = this.getAvatar();
      return obj;
    }
  }

};
