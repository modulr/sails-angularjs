(function(){
  'use strict';

  angular
  .module('log')
  .filter('filterIp', function() {
    return function(string) {
      return string.replace("::", "").replace("ffff:", "");
    };
  })
  .controller('LogRequestCtrl', ['$scope', '$translate', 'restFulSocketService', '$sailsSocket', 'logService', function($scope, $translate, restFulSocketService, $sailsSocket, logService) {

    $scope.charts = {
      method: {},
      time : {
        labels: ['min', 'average', 'max'],
        series: ['responseTime', 'middlewareLatency'],
        data: []
      }
    };

    $scope.tableResource = {
      "custom": {
        itemsPerPage: 25,
        bootstrapIcon: true
      },
      "header": [],
      "rows": []
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
        $scope.charts.method = logService.makeDataChart(response, 'method', 'count');
      });

      // Se obtienen los datos de la grafica time
      restFulSocketService.get('logRequest/chartTime/responseTime')
      .then(function(response){
        $scope.charts.time.data.push(response);
      });

      restFulSocketService.get('logRequest/chartTime/middlewareLatency')
      .then(function(response){
        $scope.charts.time.data.push(response);
      });

      // Se obtienen los datos de la tabla users
      restFulSocketService.get('logRequest/table')
      .then(function(response){
        $scope.table = response;
        $translate(['LOG.USER', 'LOG.METHOD', 'LOG.PARAMETERS', 'LOG.RESPONSETIME', 'LOG.MIDDLEWARELATENCY', 'LOG.DATE']).then(function (translations) {
          $scope.tableResource = {
            "header": [
              {'username': translations['LOG.USER']},
              {'method': translations['LOG.METHOD']},
              {'url': 'URL'},
              {'parameters': translations['LOG.PARAMETERS']},
              {'responseTime': translations['LOG.RESPONSETIME']},
              {'middlewareLatency': translations['LOG.MIDDLEWARELATENCY']},
              {'createdAt': translations['LOG.DATE']}
            ],
            "rows": $scope.table,
            "sortBy": "createdAt",
            "sortOrder": "dsc"
          };
        });
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
        if ($scope.charts.time.data.length > 0) {
          if (obj.data.responseTime < $scope.charts.time.data[0][0] || obj.data.responseTime > $scope.charts.time.data[0][2]) {
            restFulSocketService.get('logRequest/chartTime/responseTime')
            .then(function(response){
              $scope.charts.time.data[0] = response;
            });
          }

          // Si el middlewareLatency es menor al min o mayor al max se consultan los nuevos datos y se actualiza la grafica time
          if (obj.data.middlewareLatency < $scope.charts.time.data[1][0] || obj.data.middlewareLatency > $scope.charts.time.data[1][2]) {
            restFulSocketService.get('logRequest/chartTime/middlewareLatency')
            .then(function(response){
              $scope.charts.time.data[1] = response;
            });
          }
        }

        if ($scope.table.length !== undefined) {
          // Se actualiza la tabla users
          $scope.table.push(obj.data);
        }

      }
    });

  }]);

}());
