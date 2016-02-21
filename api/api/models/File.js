/**
* File.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    attributes: {

        file: {
            type: 'string'
        },
        user: {
            model: 'user'
        },
        active: {
            type: 'boolean',
            defaultsTo: true
        },
        toJSON: function() {
            var obj = this.toObject();
            delete obj.active;
            delete obj.createdAt;
            delete obj.updatedAt;
            return obj;
        }
    }
};
