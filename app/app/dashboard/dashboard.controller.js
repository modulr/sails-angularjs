(function(){
  'use strict';

  angular
  .module('dashboard')
  .controller('DashboardCtrl', ['$scope', 'restFulSocketService', 'restFulService', '$sailsSocket', 'logService', function($scope, restFulSocketService, restFulService, $sailsSocket, logService){

    $scope.countUsers = {
      total: 0,
      active: 0,
      deactive: 0
    };
    $scope.charts = {
      browser: {},
      os: {}
    };

    getUsers();
    getLogLogin();

    /**
    * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    * Methods
    * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    */
    function getLogLogin()
    {
      // Se obtienen los datos de la grafica browsers
      restFulSocketService.get('logLogin/charts/browserFamily')
      .then(function(response){
        $scope.charts.browser = logService.makeDataChart(response, 'browserFamily', 'count');
      });

      // Se obtienen los datos de la grafica OS
      restFulSocketService.get('logLogin/charts/osFamily')
      .then(function(response){

        $scope.charts.os = logService.makeDataChart(response, 'osFamily', 'count');
      });

    }
    function getUsers()
    {
      restFulService.get('user')
      .then(function(response){
        $scope.users = response;
        countUsers();
      });
    }

    function countUsers()
    {
      if ($scope.users.length > 0) {
        $scope.countUsers.total = $scope.users.length;
        $scope.countUsers.active = 0;
        $scope.countUsers.deactive = 0;
        // Se obtiene el numero de usuarios activos y no activos
        $scope.users.forEach(function(v) {
          if(v.active){
              $scope.countUsers.active++;
          }else{
              $scope.countUsers.deactive++;
          }
        });
      }
    }
    /**
    * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    * Watch
    * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    */
    $sailsSocket.subscribe('loglogin',function(obj){
      if(obj.verb === 'created'){

        // Se actualiza la grafica browsers
        logService.updateDataChart($scope.charts.browser, obj.data, 'browserFamily', 'count');

        // Se actualiza la grafica OS
        logService.updateDataChart($scope.charts.os, obj.data, 'osFamily', 'count');

      }
    });

  }]);

}());
