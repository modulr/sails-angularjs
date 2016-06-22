var _ = require('lodash');

module.exports = _.merge(_.cloneDeep(require('./base')), {

  attributes: {
    greeting: {
      type:'string'
    }
  }

});
