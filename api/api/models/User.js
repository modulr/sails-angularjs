/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var _ = require('lodash');

module.exports = _.merge(_.cloneDeep(require('./base')), {

  attributes: {
    username: {
      type: 'string',
      unique: true,
      required: true
    },
    email: {
      type: 'email',
      unique: true,
      required: true
    },
    password: {
      type: 'string',
      required: true
    },
    language: {
      type: 'string',
      defaultsTo: 'ENGLISH'
    },
    lang: {
      type: 'string',
      defaultsTo: 'en'
    },
    profile: {
      model: 'profile'
    },
    photo: {
      type: 'string',
      defaultsTo: 'avatar.jpg'
    },
    photos: {
      collection: 'photo',
      via: 'user'
    },
    // chats: {
    //     type: 'array',
    //     defaultsTo: []
    // },
    chats: {
      collection: 'chat',
      via: 'participants'
    },
    contact: {
      collection: 'contact',
      via: 'userId'
    },
    place: {
      collection: 'place',
      via: 'userId'
    },
    education: {
      collection: 'education',
      via: 'userId'
    },
    family: {
      collection: 'family',
      via: 'userId'
    },
    // para el area de RH prospect
    type: {
      type: 'string',
      defaultsTo: 'regular'// prospect, guest, regular, admin
    },
    authorizations: {
      type: 'json',
      defaultsTo: {}
    },
    logged: {
      type: 'boolean',
      defaultsTo: false
    },
    active: {
      type: 'boolean',
      defaultsTo: false
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
  },
  beforeCreate: function(values, cb){
    // Se encripta el password
    EncryptService.encrypt(values.password, function (err, hash) {
      if(err) return cb(err);
      values.password = hash;
      cb();
    });
  },
  // beforeUpdate: function(values, cb){
  //   console.log(values);
  //   if (values.deletedAt) {
  //     console.log('deleted');
  //   }
  //   cb();
  // },
  // afterUpdate: function(values, cb){
  //   if (!values.deletedAt) return cb();
  //
  //   console.log(values);
  //
  //   sails.models.user.update({ id: values.id }, { username: values.username + '-deleted', email: values.email + '-deleted'}).exec(function(err, update){
  //     if(err) return cb(err);
  //
  //     return cb();
  //   });
  // }

  // beforeUpdate: function(values, next){
  // console.log('model User beforeUpdate ' + values.password);
  // Si no es indefinido el valor password
  // if(values.password !== undefined){
  //     // Se comparan los passwords
  //     AuthService.compare( values.password, user.password, function (err, valid) {
  //     });
  //     // Se encripta el password
  //     AuthService.encrypt(values.password, function (err, hash) {
  //         if(err) return next(err);
  //         values.password = hash;
  //     });
  // }
  // next();
  // }

});
