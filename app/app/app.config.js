(function(){
  'use strict';

  angular
  .module('config',[])
  .constant(
    'config', {
      'urlAPI': window.io.sails.url,
      'storageUrl': window.storageUrl,
    }
  )
  .config(['$stateProvider', '$httpProvider', '$sailsSocketProvider', '$locationProvider', '$urlRouterProvider', '$translateProvider', function($stateProvider, $httpProvider, $sailsSocketProvider, $locationProvider, $urlRouterProvider, $translateProvider){

    /*
    |- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    |   Interceptor
    |- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    */
    $httpProvider.interceptors.push('interceptorService');
    // Iterate $httpProvider interceptors and add those to $sailsSocketProvider
    angular.forEach($httpProvider.interceptors, function iterator(interceptor) {
      $sailsSocketProvider.interceptors.push(interceptor);
    });

    $urlRouterProvider.deferIntercept();
    /*
    |- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    |   Translate
    |- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    */
    $translateProvider.useStaticFilesLoader({
      prefix: 'locales/',
      suffix: '.min.json'
    });
    $translateProvider.preferredLanguage('en');

    $translateProvider.useSanitizeValueStrategy('escaped');

    $translateProvider.useLocalStorage();

    /*
    |- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    |   HTML5 History API
    |- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    */
    $locationProvider.html5Mode({enabled: true});
    // $locationProvider
    // .html5Mode({
    //   enabled: true,
    //   requireBase: false
    // })
    // .hashPrefix('!');

  }]);

}());
