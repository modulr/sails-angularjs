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
        profile: {
            model: 'profile'
        },
        role: {
            model: 'userrole'
        },
        authorizations: {
            type: 'json',
            defaultsTo: null
        },
        logged: {
            type: 'boolean',
            defaultsTo: false
        },
        active: {
            type: 'boolean',
            defaultsTo: false
        },
        language: {
            type: 'string',
            defaultsTo: 'ENGLISH'
        },
        lang: {
            type: 'string',
            defaultsTo: 'en'
        },
        photo: {
            type: 'string',
            defaultsTo: 'avatar.jpg'
        },
        photos: {
            collection: 'photo',
            via: 'user'
        },
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
        getAvatar: function () {
            var avatar = null;
            if (this.photo == 'avatar.jpg') {
                avatar = 'public/images/' + this.photo;
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
    }

});
