(function(){
    'use strict';

    angular
    .module('errors', [])
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){

        $urlRouterProvider.otherwise('/error/');

        $stateProvider
        .state('layoutAuth.error', {
            url: '/error/:errorId',
            templateUrl: 'app/errors/error.html',
            controller: 'ErrorCtrl'
        });

    }]);

}());
