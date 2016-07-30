/**
* Base.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
    schema: true,

    attributes: {
        createdUser: {
            model: 'user',
            defaultsTo: null
            //required: true
        },
        updatedUser: {
            model: 'user',
            defaultsTo: null
            //required: true
        },
        deletedAt: {
            type: 'datetime',
            defaultsTo: null
        }
        // toJSON: function() {
        //   var obj = this.toObject();
        //   if (obj.deletedAt === null) {
        //     obj.toJSON = null;
        //     delete obj.toJSON;
        //     return obj;
        //   }
        // }
    }
    // beforeCreate: function(values, cb) {
    //   console.log(values);
    //   // values.createdUser = values.currentUser;
    //   // values.updatedUser = values.currentUser;
    //   cb();
    // }
};
