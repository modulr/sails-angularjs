/**
 * use
 * <app-comments collection="object" data="object" ng-model="modelo"></app-comments>
 */

(function(){
'use strict';

angular
    .module('helpers')
    .directive('appComments', comments);

function comments() {
    var directive = {
        restrict: 'E',
        scope: {
            src: '=src',
            user: '=user'
        },
        controller: 'CommentsCtrl',
        templateUrl: 'app/helpers/comments/comments.html'
    };
    return directive;
}
})();
