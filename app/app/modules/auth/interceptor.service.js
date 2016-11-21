(function(){
  'use strict';

  angular
  .module('auth')
  .factory('interceptorService', ['$rootScope', '$q', '$injector', function($rootScope, $q, $injector){

    return {

      request: function(config) {
        // Si el request es de tipo text/html se muestra el progressbar
        //if (config.headers.Accept == "text/html") {
        $rootScope.$broadcast(
          $.smkProgressBar({
            status:'start',
            bgColor: '',
            barColor: '#fff'
            //content:'<div class="text-center"><img src="images/loading.svg"><p>Loading...</p></div>'
          })
        );
        //}
        // Se obtiene el token de localStorage
        var token =  localStorage.getItem('token');
        // Si existe el token se envia por el header
        if (token) {
          config.headers.authorization = token;
        }
        return config;
      },

      requestError: function(rejection){
        console.log(rejection);
        return $q.reject(rejection);
      },

      response: function(response) {
        //if (response.config.headers.Accept == "text/html") {
        $rootScope.$broadcast(
          $.smkProgressBar({status:'end'})
        );
        //}
        return response;
      },

      responseError: function(rejection) {
        console.log(rejection);
        // Si no esta autenticado o no se tiene acceso se remueve el token y se envia al login
        if (rejection.status === 401 || rejection.status === 403) {
          localStorage.removeItem('token');
          $injector.get('$state').go('login');
        }else{
          var message = $injector.get('errorService').getStatusCodeText(rejection.status);
          if (message) {
            console.log(message);
          }
        }

        $rootScope.$broadcast(
          $.smkProgressBar({status:'end'})
        );

        return $q.reject(rejection);
      }

    };

  }]);

}());
