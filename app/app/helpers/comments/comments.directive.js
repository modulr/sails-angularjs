/**
* Comments to items
* @param
  model {object} // collection comments
  item  {string} // id belong comments
  src   {string} // what is? file, folder, etc...
* @use
* <comments
    src = [{comment: "Hola mundo", userId: "56610cabc13eee247069f9ab", createdAt: "2016-10-24T19:46:43.797Z"}}]
    item = "57faf0febbc925110f738c84"
    model = "file">
  </comments>
*/

(function(){
  'use strict';

  angular
  .module('helpers')
  .directive('comments', comments);

  function comments() {

    return {
      restrict: 'E',
      scope: {
        model: '=',
        item: '=',
        src: '='
      },
      templateUrl: 'app/helpers/comments/comments.html',
      controller: ['$rootScope', '$scope', 'restFulService', 'config', function($rootScope, $scope, restFulService, config)
      {
        $scope.user = {};
        $scope.src = [];

        /**
        * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        * Events
        * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        */
        $scope.showCommentBtn = function()
        {
          $('#collapseCommentBtn_' + $scope.$id).collapse('show');
        }

        $scope.create = function()
        {
          if ($('#formComment_' + $scope.$id).smkValidate()) {
            var btn = $(event.target);
            btn.button('loading');

            var data = {
              comment: $scope.formComment.comment,
              userId: $scope.user.id,
              createdAt: moment()
            };

            restFulService.post('comment/create/' +$scope.model+ '/' +$scope.item, data)
            .then(function(response) {

              if ($scope.src == undefined) {
                $scope.src = [];
              }

              $scope.src.unshift(response);

              $('#collapseCommentBtn_' + $scope.$id).collapse('hide');

              $.smkAlert({
                text: 'El comentario se creo correctamente',
                type: 'success'
              });
            })
            .finally(function() {
              btn.button('reset');
              $scope.formComment = {};
            });
          }

        };

        $rootScope.$watch('user', function(nv, ov) {
          if (nv) {
            $scope.user = nv;
          }
        });


      }]
    };

  }

})();
