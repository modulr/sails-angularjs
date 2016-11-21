(function(){
  'use strict';

  angular
  .module('helpers')
  .factory('restFulService', ['$http', '$q', 'config', function($http, $q, config){

    return{
      get:function(model, params){
        var deferred = $q.defer();

        $http.get(config.urlAPI +'/'+ model, params)
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

        $http.post(config.urlAPI +'/'+ model, params)
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

        $http.put(config.urlAPI +'/'+ model, params)
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

        $http.delete(config.urlAPI +'/'+ model, params)
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
