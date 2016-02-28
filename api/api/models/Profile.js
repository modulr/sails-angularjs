/**
* Profile.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var _ = require('lodash');

module.exports = _.merge(_.cloneDeep(require('./base')), {

  attributes: {
    user: {
      model: 'user'
    },
    firstName: {
      type: 'string',
      defaultsTo: ''
    },
    lastName: {
      type: 'string',
      defaultsTo: ''
    },
    job: {
      type: 'string',
      defaultsTo: ''
    },
    department: {
      type: 'string',
      defaultsTo: ''
    },
    company: {
      type: 'string',
      defaultsTo: ''
    },
    gender: {
      type: 'string',
      defaultsTo: ''
    },
    birthday: {
      type: 'date',
      defaultsTo: ''
    },
    relationship: {
      type: 'string',
      defaultsTo: ''
    },
    contact: {
      type: 'json',
      defaultsTo: {
        emails: [],
        phones: []
      }
    },
    getFullName: function () {
      var fullName = null;
      if (this.firstName !== '' || this.lastName !== '') {
        fullName = this.firstName + ' ' + this.lastName;
      }
      return fullName;
    },
    toJSON: function() {
      var obj = this.toObject();
      obj.fullName = this.getFullName();
      return obj;
    }
  }

});
