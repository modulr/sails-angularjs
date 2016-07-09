(function(){
  'use strict';

  angular
  .module('helpers')
  .factory('restFulSocketService', ['$q', '$sailsSocket', function($q, $sailsSocket){

    var token = localStorage.getItem('token');

    return{

      // Get a collection
      get: function (model, params) {
        var deferred = $q.defer();
        $sailsSocket({
          method: 'get',
          params: params,
          url: '/' + model,
          headers: { authorization: token }
        })
        .success(function(data, status, headers, config) {
          deferred.resolve(data);
        }).
        error(function(data, status, headers, config) {
          $.smkAlert({
              text: 'Error en restFulSocketService',
              type: 'danger',
              position: 'bottom-left'
          });
          deferred.reject(status);
        });
        return deferred.promise;
      },

      // Send a form
      post: function (model, params) {
        var deferred = $q.defer();
        $sailsSocket({
          method: 'post',
          params: params,
          url: '/' + model,
          headers: { authorization: token }
        })
        .success(function(data, status, headers, config) {
          deferred.resolve(data);
        }).
        error(function(data, status, headers, config) {
          $.smkAlert({ text: 'Error en restFulSocketService', type: 'danger' });
          deferred.reject(status);
        });
        return deferred.promise;
      },

      // Update Collection or model
      put: function (model, params) {
        var deferred = $q.defer();
        $sailsSocket({
          method: 'put',
          params: params,
          url: '/' + model,
          headers: { authorization: token }
        })
        .success(function(data, status, headers, config) {
          deferred.resolve(data);
        }).
        error(function(data, status, headers, config) {
          $.smkAlert({ text: 'Error en restFulSocketService', type: 'danger' });
          deferred.reject(status);
        });
        return deferred.promise;
      },

      // Delete a model
      delete: function (model, params) {
        var deferred = $q.defer();
        $sailsSocket({
          method: 'delete',
          params: params,
          url: '/' + model,
          headers: { authorization: token }
        })
        .success(function(data, status, headers, config) {
          deferred.resolve(data);
        }).
        error(function(data, status, headers, config) {
          $.smkAlert({ text: 'Error en restFulSocketService', type: 'danger' });
          deferred.reject(status);
        });
        return deferred.promise;
      },

      // Watch change model
      // on: function (model) {
      //   $sailsSocket.on(model,function(obj){
      //     return obj;
      //   });
      // }
    };
  }]);

}());
