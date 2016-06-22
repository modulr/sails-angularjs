(function(){
  'use strict';

  angular
  .module('log')
  .factory('logService', [function(){

    return{

      makeDataChart: function(data, label, value)
      {
        var res = {
          labels: [],
          data: [],
          values: []
        };

        data.forEach(function(v) {
          res.labels.push(v[label]);
          res.values.push(v[value]);
        });

        res.data = this.percentage(res.values);

        return res;
      },

      updateDataChart: function(collection, model, label, value)
      {
        var pos = collection.labels.indexOf(model[label]);

        if ( pos != -1 ){
          collection.values[pos] = collection.values[pos] + model[value];
        } else {
          collection.labels.push(model[label]);
          collection.values.push(model[value]);
        }

        collection.data = this.percentage(collection.values);
      },

      percentage: function(array)
      {
        var res = [];

        var total = array.reduce(function(a, b) {
          return a + b;
        });

        array.forEach(function(v){
          res.push(parseFloat(((v / total) * 100).toFixed(2)));
        });

        return res;
      }

    };

  }]);

}());
