(function(){
  'use strict';

  angular
  .module('log')
  .filter('filterIp', function() {
    return function(string) {
      return string.replace("::", "").replace("ffff:", "");
    };
  })
  .controller('LogLoginCtrl', ['$scope', 'restFulSocketService', '$sailsSocket', 'logService', function($scope, restFulSocketService, $sailsSocket, logService) {

    $scope.charts = {
      browser: {},
      os: {}
    };

    $scope.table = {};

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
        $scope.charts.browser = logService.makeDataChart(response.data, 'browserFamily', 'count');
      });

      // Se obtienen los datos de la grafica OS
      restFulSocketService.get('logLogin/charts/osFamily')
      .then(function(response){

        $scope.charts.os = logService.makeDataChart(response.data, 'osFamily', 'count');
      });

      // Se obtienen los datos de la tabla users
      restFulSocketService.get('logLogin/table')
      .then(function(response){
        $scope.table = response.data;
      });
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

        // Se actualiza la tabla users
        $scope.table.push(obj.data);

      }
    });

  }]);

}());
