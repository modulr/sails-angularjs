var glob  = require('glob');
var path  = require('path');

module.exports = function seeds(sails) {
  return {
    initialize: function (cb) {
      sails.after('hook:orm:loaded', function () {

        // Find all seed files by environment.
        glob('seeds/' + sails.config.environment + '/**/*.json',  function (err, files) {

          // Populate the model with a given seed.
          function populate(seed, next) {
            var attributes = Object.keys(seed.data[0] || {});
            var criteria = {};
            criteria[attributes[0]] = seed.data[0][attributes[0]];
            sails.models[seed.model].findOrCreate(criteria, seed.data, next);
          }

          // Extract seeds data.
          var seeding = files.map(function (filePath) {
            return {
              model: path.basename(filePath, '.json'),
              data: require('../../../' + filePath)
            };
          });

          async.eachSeries(seeding, populate, cb);

        });

      });
    }
  };
};
