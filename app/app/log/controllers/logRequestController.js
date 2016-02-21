(function(){
  'use strict';

  angular
  .module('log')
  .filter('filterIp', function() {
    return function(string) {
      return string.replace("::", "").replace("ffff:", "");
    };
  })
  .controller('LogRequestCtrl', ['$scope', 'restFulSocketService', '$sailsSocket', 'logService', function($scope, restFulSocketService, $sailsSocket, logService) {

    $scope.charts = {
      method: {},
      time : {
        labels: ['min', 'average', 'max'],
        series: ['responseTime', 'middlewareLatency'],
        data: []
      }
    };

    $scope.table = {};


    getLogRequest();
    /**
    * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    * Methods
    * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    */
    function getLogRequest()
    {
      // Se obtienen los datos de la grafica method
      restFulSocketService.get('logRequest/charts/method')
      .then(function(response){
        $scope.charts.method = logService.makeDataChart(response.data, 'method', 'count');
      });

      // Se obtienen los datos de la grafica time
      restFulSocketService.get('logRequest/chartTime/responseTime')
      .then(function(response){
        $scope.charts.time.data.push(response.data);
      });

      restFulSocketService.get('logRequest/chartTime/middlewareLatency')
      .then(function(response){
        $scope.charts.time.data.push(response.data);
      });

      // Se obtienen los datos de la tabla users
      restFulSocketService.get('logRequest/table')
      .then(function(response){
        $scope.table = response.data;
      });
    }
    /**
    * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    * Watch
    * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    */
    $sailsSocket.subscribe('logrequest',function(obj){
      if(obj.verb === 'created'){

        // Se actualiza la grafica method
        logService.updateDataChart($scope.charts.method, obj.data, 'method', 'count');

        // Si el responseTime es menor al min o mayor al max se consultan los nuevos datos y se actualiza la grafica time
        if (obj.data.responseTime < $scope.charts.time.data[0][0] || obj.data.responseTime > $scope.charts.time.data[0][2]) {
          restFulSocketService.get('logRequest/chartTime/responseTime')
          .then(function(response){
            $scope.charts.time.data[0] = response.data;
          });
        }

        // Si el middlewareLatency es menor al min o mayor al max se consultan los nuevos datos y se actualiza la grafica time
        if (obj.data.middlewareLatency < $scope.charts.time.data[1][0] || obj.data.middlewareLatency > $scope.charts.time.data[1][2]) {
          restFulSocketService.get('logRequest/chartTime/middlewareLatency')
          .then(function(response){
            $scope.charts.time.data[1] = response.data;
          });
        }

        // Se actualiza la tabla users
        $scope.table.push(obj.data);

      }
    });

  }]);

}());
