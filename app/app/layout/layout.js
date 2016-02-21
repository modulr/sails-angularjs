(function(){
  'use strict';

  angular
  .module('layout', [])
  .config(['$stateProvider', function($stateProvider){

    $stateProvider
    .state('layoutAuth', {
      abstract: true,
      templateUrl: 'app/layout/views/layoutAuth.html',
      controller: 'LayoutAuthCtrl',
      data: {
        access : false
      }
    })
    .state('layout', {
      abstract: true,
      templateUrl: 'app/layout/views/layout.html',
      controller: 'LayoutCtrl',
      data: {
        access : true
      }
      // resolve: {
      //   getChatUsers: function(restFulSocketService){
      //     return restFulSocketService.get('user/chatUsers')
      //     .then(function (response) {
      //       return response;
      //     });
      //   }
      // }
    });

  }]);

}());
