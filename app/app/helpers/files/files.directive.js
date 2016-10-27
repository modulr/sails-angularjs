/**
* Files magament
* @param
  folderId        {object}
  uploadSize      {string}
  uploadLimit     {string}
  uploadFormats   {string}
  uploadDisabled  {boolean}
  uploadMultiple  {boolean}
  uploadTex       {string}
* Use
* <files
    folder-id = "5798c4e2bb2c73dcba6d9906"
    upload-multiple = 'true',
    upload-size = '50',
    upload-limit ='10',
    upload-formats ="'jpg,jpeg,png,gif,pdf,xml,xls,xlsx,doc,docx,ppt,pptx,zip,rar'"
    upload-disabled = 'false',
    upload-text = "{{ 'DRAGORCLICK' | translate }}">
  </files>
*/
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
      controller: ['$rootScope', '$scope', 'restFulService', 'config', function($rootScope, $scope, restFulService, config)
      {
        $scope.urlAPI = config.urlAPI;
        $scope.storageUrl = config.storageUrl;
        $scope.token = localStorage.getItem('token');
        $scope.user = $rootScope.user;

        $scope.layout = 'list';
        $scope.breadcrumb = [];
        $scope.currentFolderId = {};

        $scope.foldersAndFiles = [];
        $scope.folderOrFile = {};
        $scope.showCreateFolderInput = false;
        $scope.showInfo = false;
        $scope.isFileOrFolder = null;
        $scope.loading = true;

        $('.files').each(function() { // the containers for all your galleries
          $(this).magnificPopup({
            delegate: '.image-link', // the selector for gallery item
            type: 'image',
            gallery: {
              enabled:true
            }
          });
        });

        /**
        * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        * Methods
        * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        */
        function isFileOrFolder(type) {
          if (type) {
            $scope.isFileOrFolder = 'file';
            return 'file';
          } else {
            $scope.isFileOrFolder = 'folder';
            return 'folder';
          }
        }

        function makeArray(obj) {

          var array = [];

          array = obj.map(function(item){
            return item.id;
          });

          return array;

        }

        /**
        * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        * Events
        * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        */
        $scope.toggleLayout = function()
        {

          if ($scope.layout === 'list'){
            $scope.layout = 'grid';
          } else {
            $scope.layout = 'list';
          }

        };

        $scope.loadUsers = function(query)
        {
          return restFulService.get('user/findByUsernameOrFullname/' + query)
          .then(function(data) {
            return data;
          });
        };

        $scope.createFolder = function()
        {
          if (!$scope.showCreateFolderInput) {
            $scope.showCreateFolderInput = true;
          } else {
            if ($('#formFolder_' + $scope.$id).smkValidate()) {

              var data = {
                name: $scope.formFolder.name,
                parentId: $scope.currentFolderId,
                owner: $scope.user.id
              };

              restFulService.post('folder/create', data)
              .then(function(response) {

                $scope.foldersAndFiles.push(response);

                $.smkAlert({
                  text: 'El folder se creo correctamente.',
                  type: 'success',
                  position: 'bottom-left'
                });
              })
              .finally(function() {
                $scope.showCreateFolderInput = false;
                $scope.formFolder = {};
              });
            }
          }
        };

        $scope.openFolder = function(folder)
        {
          if (isFileOrFolder(folder.type) == 'folder') {
            $scope.showInfo = false;
            $scope.currentFolderId = folder.id;
            $scope.foldersAndFiles = [];
            $scope.loading = true;

            var index = $scope.breadcrumb.indexOf(folder);
            if (index >= 0) {
              $scope.breadcrumb.splice(index+1, $scope.breadcrumb.length);
            } else {
              $scope.breadcrumb.push(folder);
            }

            restFulService.get('folder/getFolderAndFilesByParent/' + folder.id)
            .then(function(response) {
              $scope.foldersAndFiles = response;
              $scope.loading = false;
            });
          }
        };

        $scope.save = function(event)
        {
          if ($('#formFolderOrFile_' + $scope.$id).smkValidate()) {

            var data = {
              name: $scope.folderOrFile.name,
              description: $scope.folderOrFile.description,
              shared: makeArray($scope.folderOrFile.shared),
              updatedAt: moment()
            };

            var url = isFileOrFolder($scope.folderOrFile.type);

            restFulService.put(url + '/' + $scope.folderOrFile.id, data)
            .then(function(response) {

              $scope.foldersAndFiles[$scope.folderOrFile.index] = response;

              $.smkAlert({
                text: 'Los cambios se guardaron correctamente',
                type: 'success',
                position: 'bottom-left'
              });
            });
          }
        };

        $scope.delete = function(event)
        {
          $.smkConfirm({
            text:'Se borrara definitivamente.',
            accept:'Aceptar',
            cancel:'Cancelar'
          }, function(e) { if(e) {

            var url = isFileOrFolder($scope.folderOrFile.type);

            restFulService.delete(url + '/' + $scope.folderOrFile.id)
            .then(function(response) {

              $scope.foldersAndFiles.splice($scope.folderOrFile.index, 1);

              $scope.showInfo = false;

              $.smkAlert({
                text: 'Los cambios se guardaron correctamente',
                type: 'success',
                position: 'bottom-left'
              });
            });

          }});

        };

        $scope.view = function(item)
        {
          var url = isFileOrFolder(item.type);

          restFulService.get(url + '/findOne/' + item.id)
          .then(function(response) {
            $scope.folderOrFile = response;
            $scope.folderOrFile.index = $scope.foldersAndFiles.indexOf(item);
          });

          if (!$scope.showInfo) {
            $scope.showInfo = true;
          }

        };

        /**
        * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        * watch
        * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        */
        $scope.$watch('folderId', function(nv, ov) {
          if (nv) {
            restFulService.get('folder/getFolderAndFiles/' + nv)
            .then(function(response) {
              $scope.foldersAndFiles = response.children;
              $scope.breadcrumb.push(response.folder);
              $scope.storageUrl = $scope.storageUrl+ '/' +response.folder.url;
              $scope.currentFolderId = nv;

              $scope.loading = false;
            });
          }
        });

        $scope.$watch('file', function(nv, ov) {
          if (nv) {
            $scope.foldersAndFiles.push(nv);
          }
        });

      }]
    };

  }

})();
