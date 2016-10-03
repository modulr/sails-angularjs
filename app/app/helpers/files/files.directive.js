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
        $scope.storageUrl = config.storageUrl;
        $scope.token = localStorage.getItem('token');

        $scope.layout = 'list';
        $scope.folder = {};
        $scope.breadcrumb = [];
        $scope.foldersFiles = [];
        $scope.loading = true;
        $scope.formEdit = {};
        $scope.info = {};


        /**
        * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        * Methods
        * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        */
        function isFileOrFolder(type) {
          if (type) {
            return 'file';
          } else {
            return 'folder';
          }
        }

        /**
        * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        * Events
        * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        */
        $scope.createFolder = function(event)
        {
          if ($('#formFolder_' + $scope.$id).smkValidate()) {
            var btn = $(event.target);
            btn.button('loading');

            var data = {
              name: $scope.formFolder.name,
              parentId: $scope.folder.currentFolderId,
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

        $scope.openFolder = function(folder)
        {
          if (isFileOrFolder(folder.type) == 'folder') {
            $scope.loading = true;
            $scope.foldersFiles = [];
            $scope.folder.currentFolderId = folder.id;

            var index = $scope.breadcrumb.indexOf(folder);
            if (index >= 0) {
              $scope.breadcrumb.splice(index+1, $scope.breadcrumb.length);
            } else {
              $scope.breadcrumb.push(folder);
            }

            restFulService.get('folder/getFolderAndFilesByParent/' + folder.id)
            .then(function(response) {
              $scope.loading = false;
              $scope.foldersFiles = response;
            });
          }
        };

        $scope.edit = function(folderFile, index)
        {
          $('#modalEdit_' + $scope.$id).modal('show');
          $scope.formEdit = angular.copy(folderFile);
          $scope.formEdit.index = index;
        };

        $scope.save = function(event)
        {
          if ($('#formEdit_' + $scope.$id).smkValidate()) {

            var btn = $(event.target);
            btn.button('loading');

            var data = {
              name: $scope.formEdit.name,
              updatedAt: moment()
            };

            var url = isFileOrFolder($scope.formEdit.type);

            restFulService.put(url + '/' + $scope.formEdit.id, data)
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

        $scope.delete = function(item, index)
        {
          $.smkConfirm({text:'Se borrara definitivamente.', accept:'Aceptar', cancel:'Cancelar'}, function(e){if(e){

            var url = isFileOrFolder(item.type);

            restFulService.delete(url + '/' + item.id)
            .then(function(response) {

              $scope.foldersFiles.splice(index, 1);

              $.smkAlert({
                text: 'El archivo se elimino correctamente',
                type: 'success'
              });
            });

          }});

        };

        $scope.view = function(folderFile)
        {
          $('#modalInfo_' + $scope.$id).modal('show');
          $scope.info = folderFile;
          console.log(folderFile);
        };

        $scope.toggleLayout = function()
        {

          if ($scope.layout === 'list'){
            $scope.layout = 'grid';
          } else {
            $scope.layout = 'list';
          }

        };




        /**
        * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        * watch
        * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        */
        $scope.$watch('folderId', function(nv, ov) {
          if (nv !== undefined && nv !== null) {
            restFulService.get('folder/getFolderAndFiles/' + nv)
            .then(function(response) {
              $scope.loading = false;
              $scope.breadcrumb.push(response.folder);
              $scope.foldersFiles = response.children;
              $scope.folder = response.folder;
              $scope.folder.currentFolderId = $scope.folderId;
              $scope.storageUrl = $scope.storageUrl+'/'+response.folder.url;
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
