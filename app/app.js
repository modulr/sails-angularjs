(function(){
  'use strict';

  angular
  .module('modulr', [
    'sails.io',
    'ui.router',
    'ngCookies',
    'ngAnimate',
    'ngSanitize',
    'pascalprecht.translate',
    'angularMoment',
    'ui.tree',
    'ngTagsInput',
    'chart.js',
    'ngTasty',

    'mdr.select2',
    'mdr.file',
    'mdr.datepicker',
    //'mdr.table',

    // Helpers
    'mdr.helpers',

    // App
    'layout',
    'auth',
    'error',
    'users',
    'access',
    'modules',
    'chat',
    'log',

    // Modules
    'dashboard'

  ])
  .constant('config', {
    apiUrl: window.io.sails.url
  })
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
      suffix: '.json'
    });
    $translateProvider.preferredLanguage('en');

    $translateProvider.useSanitizeValueStrategy('escaped');

    $translateProvider.useLocalStorage();

    /*
    |- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    |   Routes
    |- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    */
    // use the HTML5 History API
    $locationProvider.html5Mode({enabled: true});
    // $locationProvider
    // .html5Mode({
    //   enabled: true,
    //   requireBase: false
    // })
    // .hashPrefix('!');

  }])
  .run(['$rootScope', '$state', '$urlRouter', 'authService', 'restFulService', function($rootScope, $state, $urlRouter, authService, restFulService){

    $rootScope.$on('$locationChangeSuccess', function(e) {

      if(authService.isAuthenticated() && !angular.isDefined($rootScope.user)){

        e.preventDefault();

        restFulService.get('user/findUserByToken')
        .then(function(response){
          $rootScope.user = response;
          $urlRouter.sync();
        });

      }

    });

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      if (authService.isAuthenticated()){

        var parts = toState.name.split('.');
        var state = parts[1];
        var authorizations = $rootScope.user.authorizations;

        for (var key in authorizations) {
          if (state == key) {
            if (!authorizations[key].access) {
              event.preventDefault();
              $state.go('layoutAuth.error', { errorId: 401 });
            }
          }
          for (var k in authorizations[key]) {
            if ((authorizations[key][k].access) !== undefined) {
              if (state == k) {
                if (!authorizations[key][k].access) {
                  event.preventDefault();
                  $state.go('layoutAuth.error', { errorId: 401 });
                }
              }
            }

          }
        }
      }

      if (authService.isAuthenticated() && !toState.data.access) {
        event.preventDefault();
        $state.go('layout.dashboard');
      }
    });

    // $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
    //   // console.log(event);
    //   console.log(error);
    // });
    //
    // $rootScope.$on('$stateChangeSuccess', function(event) {
    //   console.log(event);
    //   // updateBreadcrumbs();
    // });

    $urlRouter.listen();

  }]);

}());
