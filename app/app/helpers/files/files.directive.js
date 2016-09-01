(function() {
  'use strict';

  angular
  .module('helpers')
  .directive('files', files);

  function files() {

    return {
      restrict: 'E',
      //require: 'ngModel',
      scope: {
        //files: '=ngModel',
        folderId: '@',
        item: '=',
        uploadSize: '=',
        uploadLimit: '=',
        uploadFormats: '=',
        uploadDisabled: '=',
        uploadMultiple: '=',
        uploadText: '@'
      },
      templateUrl: 'app/helpers/files/files.html',
      controller: ['$rootScope', '$scope', 'restFulService', 'config', function($rootScope, $scope, restFulService, config){

        $scope.urlAPI = config.urlAPI;
        $scope.token = localStorage.getItem('token');

        $scope.layout = 'list';
        $scope.home = {};
        $scope.breadcrumb = [];
        $scope.foldersFiles = [];
        $scope.loading = true;

        /**
        * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        * Events
        * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        */

        $scope.openFolder = function(folder)
        {
          $scope.loading = true;
          $scope.foldersFiles = [];
          $scope.home.currentFolderId = folder.id;

          var index = $scope.breadcrumb.indexOf(folder);
          if (index >= 0) {
            $scope.breadcrumb.splice(index+1, $scope.breadcrumb.length);
          } else {
            $scope.breadcrumb.push(folder);
          }

          restFulService.get('folder/byParent/' + folder.id)
          .then(function(response) {
            $scope.loading = false;
            $scope.foldersFiles = response;
          });
        };

        $scope.toggleLayout = function()
        {

          if ($scope.layout === 'list'){
            $scope.layout = 'grid';
          } else {
            $scope.layout = 'list';
          }

        };

        $scope.edit = function(folderFile, index)
        {
          $('#modalEdit_' + $scope.$id).modal('show');
          $scope.formEdit = angular.copy(folderFile);
          $scope.formEdit.index = index;

          if ($scope.formEdit.type) {
            $scope.formEdit.editUrl = 'file';
          } else {
            $scope.formEdit.editUrl = 'folder';
          }
        };

        $scope.save = function(event)
        {
          if ($('#formEdit_' + $scope.$id).smkValidate()) {

            var btn = $(event.target);
            btn.button('loading');

            var data = {
              name: $scope.formEdit.name
            };

            restFulService.put($scope.formEdit.editUrl + '/' + $scope.formEdit.id, data)
            .then(function(response) {

              $scope.foldersFiles[$scope.formEdit.index] = response;

              $.smkAlert({
                text: 'El archivo se actualizo correctamente',
                type: 'success'
              });
            })
            .finally(function() {
              btn.button('reset');
              $('#modalEdit_' + $scope.$id).modal('hide');
            });
          }

        };

        $scope.delete = function(event)
        {
          var btn = $(event.target);
          btn.button('loading');

          restFulService.delete($scope.formEdit.editUrl + '/' + $scope.formEdit.id)
          .then(function(response) {

            $scope.foldersFiles.splice([$scope.formEdit.index], 1);

            $.smkAlert({
              text: 'El archivo se elimino correctamente',
              type: 'success'
            });
          })
          .finally(function() {
            btn.button('reset');
            $('#modalEdit_' + $scope.$id).modal('hide');
          });

        };

        $scope.createFolder = function(event)
        {
          if ($('#formFolder_' + $scope.$id).smkValidate()) {
            var btn = $(event.target);
            btn.button('loading');

            var data = {
              name: $scope.formFolder.name,
              parentId: $scope.home.currentFolderId,
              item: $scope.home.item,
              owner: $rootScope.user.id
            };

            restFulService.post('folder', data)
            .then(function(response) {

              $scope.foldersFiles.push(response);

              $.smkAlert({
                text: 'El folder se creo correctamente',
                type: 'success'
              });
            })
            .finally(function() {
              btn.button('reset');
              $('#modalFolder_' + $scope.$id).modal('hide');
              $scope.formFolder = {};
            });
          }
        };


        /**
        * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        * watch
        * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        */
        $scope.$watch('item', function(nv, ov) {
          if (nv !== undefined && nv !== null) {
            restFulService.get('folder/byItem/' + $scope.folderId +'/'+ nv)
            .then(function(response) {
              $scope.loading = false;
              $scope.breadcrumb.push(response.home);
              $scope.foldersFiles = response.children;
              $scope.home = response.home;
              $scope.home.item = nv;
              $scope.home.currentFolderId = $scope.folderId;
            });
          }
        });

        $scope.$watch('file', function(nv, ov) {
          if (nv !== undefined && nv !== null) {
            $scope.foldersFiles.push(nv);
          }
        });

        $('.files').each(function() { // the containers for all your galleries
          $(this).magnificPopup({
            delegate: '.image-link', // the selector for gallery item
            type: 'image',
            gallery: {
              enabled:true
            }
          });
        });

      }]
    };

  }

})();
