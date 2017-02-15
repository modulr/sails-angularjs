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
        $scope.isFileOrFolder = null;
        $scope.file = null;

        $scope.showCreateFolderInput = false;
        $scope.showInfo = false;
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

        $scope.IntroOptions = {
          steps:[
            {
              element: '#step1',
              intro: "Crea una carpeta o cambia la visualizacion de los archivos."
            },
            {
              element: '#step2',
              intro: "Lista de carpetas/archivos.<br><small>Selecciona una carpeta/archivo para ver detalles</small>",
              position: 'top'
            },
          ],
          showStepNumbers: false,
          showBullets: false,
          exitOnOverlayClick: true,
          exitOnEsc:true,
          prevLabel: '<span>←</span>',
          nextLabel: '<span>→</span>'
        };

        $scope.IntroOptionsInfo = {
          steps:[
            {
              element: '#step3',
              intro: 'Detalles de la carpeta/archivo seleccionado.',
              position: 'left'
            },
            {
              element: '#step4',
              intro: "Edita el nombre y/o agrega una descripcion.",
              position: 'left'
            },
            {
              element: '#step5',
              intro: 'Comparte la carpeta/archivo con algun usuario.',
              position: 'left'
            },
            {
              element: '#step6',
              intro: 'Haz u comentario de la carpeta/archivo.',
              position: 'left'
            }
          ],
          showStepNumbers: false,
          showBullets: false,
          exitOnOverlayClick: true,
          exitOnEsc:true,
          prevLabel: '<span>←</span>',
          nextLabel: '<span>→</span>'
        };


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

                $scope.view(response);

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
            } else {
              $scope.showCreateFolderInput = false;

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

        $scope.view = function(item)
        {
          var url = isFileOrFolder(item.type);

          restFulService.get(url + '/findOne/' + item.id)
          .then(function(response) {
            item.comments = response.comments;
            $scope.folderOrFileOriginal = angular.copy(item);
            $scope.folderOrFile = item;
            $scope.folderOrFile.index = $scope.foldersAndFiles.indexOf(item);
          });

          if (!$scope.showInfo) {
            $scope.showInfo = true;
          }

        };

        $scope.save = function(field)
        {
          if ($('#formFolderOrFile_' + $scope.$id).smkValidate()) {

            var data = null;

            switch (field) {
              case 'name':
                if ($scope.folderOrFile.name !== $scope.folderOrFileOriginal.name) {
                  data = {
                    name: $scope.folderOrFile.name
                  };
                }
                break;
              case 'description':
                if ($scope.folderOrFile.description !== $scope.folderOrFileOriginal.description) {
                  data = {
                    description: $scope.folderOrFile.description
                  };
                }
                break;
              case 'shared':
                if ($scope.folderOrFile.shared.length !== $scope.folderOrFileOriginal.shared.length) {
                  data = {
                    shared: makeArray($scope.folderOrFile.shared)
                  };
                }
                break;
            }

            if (data) {
              var url = isFileOrFolder($scope.folderOrFile.type);

              restFulService.put(url + '/' + $scope.folderOrFile.id, data)
              .then(function(response) {
                $.smkAlert({
                  text: 'Los cambios se guardaron correctamente',
                  type: 'success',
                  position: 'bottom-left'
                });
              });
            }

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

        $scope.$watch('file', function(nv) {
          if (nv) {
            $scope.foldersAndFiles.push(nv);
            $scope.view(nv);
            //$('#collapseUpload_' + $scope.$id).collapse('hide');
          }
        });

      }]
    };

  }

})();
