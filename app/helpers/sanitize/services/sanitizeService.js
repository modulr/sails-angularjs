(function(){
  'use strict';

  angular
  .module('modulr.helpers')
  .factory('sanitizeService', sanitizeService);

  sanitizeService.$inject = ['$sanitize'];
  function sanitizeService($sanitize){

    return{
      array:function(array){
        var data = {};
        $.each(array, function(key, val) {
          data[key] = $sanitize(val);
        });
        return data;
      },
      value:function(value){
        return $sanitize(value);
      }
    };

  }

}());
