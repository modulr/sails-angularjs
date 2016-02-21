(function(){
  'use strict';

  angular
  .module('mdr.helpers')
  .factory('restFulService', ['$http', '$q', 'config', function($http, $q, config){

    return{
      get:function(model, params){
        var deferred = $q.defer();

        $http.get(config.apiUrl +'/'+ model, params)
        .success(function(response){
          deferred.resolve(response);
        })
        .error(function(error, status){
          var err = {
            error: error,
            status: status
          };
          deferred.reject(err);
        });

        return deferred.promise;
      },
      post:function(model, params){
        var deferred = $q.defer();

        $http.post(config.apiUrl +'/'+ model, params)
        .success(function(response){
          deferred.resolve(response);
        })
        .error(function(error, status){
          var err = {
            error: error,
            status: status
          };
          deferred.reject(err);
        });

        return deferred.promise;
      },
      put:function(model, params){
        var deferred = $q.defer();

        $http.put(config.apiUrl +'/'+ model, params)
        .success(function(response){
          deferred.resolve(response);
        })
        .error(function(error, status){
          var err = {
            error: error,
            status: status
          };
          deferred.reject(err);
        });

        return deferred.promise;
      },
      delete:function(model, params){
        var deferred = $q.defer();

        $http.delete(config.apiUrl +'/'+ model, params)
        .success(function(response){
          deferred.resolve(response);
        })
        .error(function(error, status){
          var err = {
            error: error,
            status: status
          };
          deferred.reject(err);
        });

        return deferred.promise;
      }
    };

  }]);

}());
