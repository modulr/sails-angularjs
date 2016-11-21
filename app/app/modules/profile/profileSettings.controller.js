(function(){
  'use strict';

  angular
  .module('users')
  .controller('ProfileSettingsCtrl', ['$rootScope', '$scope', '$translate', 'restFulService', ProfileSettingsCtrl]);

  function ProfileSettingsCtrl($rootScope, $scope, $translate, restFulService) {

    $scope.formAccount = {};
    $scope.formPassword = {};


    /*
    |- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    |   Events
    |- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    */
    $scope.saveAccount = function(event)
    {
      if($('#formAccount').smkValidate()){

        var btn = $(event.target);
        btn.button('loading');

        var data = {
          username: $scope.user.username,
          email: $scope.user.email,
          language: $scope.formAccount.language.language,
          lang: $scope.formAccount.language.lang
        };

        restFulService.put('user/updateAccount/' + $scope.user.id, data)
        .then(function(response){

          if (response.emailChange) {
            $translate('PROFILE.MESSAGES.EMAIL-CHANGE.INFO', { email: response.user.email })
            .then(function (translate) {
              $.smkAlert({
                text: translate,
                type: 'info',
                position: 'bottom-left',
                permanent: true
              });
            });
          }

          $scope.user.username = response.user.username;
          $scope.user.email = response.user.email;
          $scope.user.language = response.user.language;
          $scope.user.lang = response.user.lang;

          if ($rootScope.user.id == $scope.user.id) {
            $rootScope.user.username = response.user.username;
            $rootScope.user.email = response.user.email;
            $rootScope.user.language = response.user.language;
            $rootScope.user.lang = response.user.lang;
            $translate.use(response.user.lang);
          }

          $translate('MESSAGES.SUCCESS').then(function (translate) {
            $.smkAlert({
              text: translate,
              type: 'success',
              position: 'bottom-left'
            });
          });

        })
        .catch(function(error){
          if (error.status == 500) {
            var value = errorService.getRawMessageValue(error.error.raw.message);
            $translate('PROFILE.MESSAGES.ACCOUNT.ERROR', { username: value })
            .then(function (translate) {
              $.smkAlert({
                text: translate,
                type: 'warning',
                position: 'bottom-left'
              });
            });
          }
        })
        .finally(function(){
          btn.button('reset');
        });
      }
    };

    $scope.deactivateAccount = function($event)
    {
      $translate(['PROFILE.MESSAGES.DEACTIVATEACCOUNT.CONFIRM.TEXT','PROFILE.MESSAGES.DEACTIVATEACCOUNT.CONFIRM.BTNACCEPT','PROFILE.MESSAGES.DEACTIVATEACCOUNT.CONFIRM.BTNCANCEL','PROFILE.MESSAGES.DEACTIVATEACCOUNT.CONFIRM.SUCCESS']).then(function (translations) {
        $.smkConfirm({
          text: translations['PROFILE.MESSAGES.DEACTIVATEACCOUNT.CONFIRM.TEXT'],
          accept: translations['PROFILE.MESSAGES.DEACTIVATEACCOUNT.CONFIRM.BTNACCEPT'],
          cancel: translations['PROFILE.MESSAGES.DEACTIVATEACCOUNT.CONFIRM.BTNCANCEL']
        }, function(e){if(e){
          var btn = $(event.target);
          btn.button('loading');

          restFulService.put('user/' + $scope.user.id, { active: false })
          .then(function(response){

            $scope.user.active = response.active;

            $.smkAlert({
              text: translations['PROFILE.MESSAGES.DEACTIVATEACCOUNT.CONFIRM.SUCCESS'],
              type: 'success',
              position: 'bottom-left'
            });
          })
          .finally(function(){
            btn.button('reset');
          });
        }});
      });
    };

    $scope.savePassword = function($event)
    {
      if($('#formPassword').smkValidate()){
        if( $.smkEqualPass('#password', '#rePassword') ){

          var btn = $(event.target);
          btn.button('loading');

          // Se actualiza el profile
          restFulService.put('user/updatePassword/' + $scope.user.id, $scope.formPassword)
          .then(function(response){
            $translate('PROFILE.MESSAGES.CHANGEPASSWORD.SUCCESS').then(function (translate) {
              $.smkAlert({
                text: translate,
                type: 'success',
                position: 'bottom-left'
              });
            });
            $scope.formPassword = {};
          })
          .catch(function(error){
            if (error.status == 400) {
              $translate('PROFILE.MESSAGES.CHANGEPASSWORD.ERROR').then(function (translate) {
                $.smkAlert({
                  text: translate,
                  type: 'warning',
                  position: 'bottom-left'
                });
              });
            }
          })
          .finally(function(){
            btn.button('reset');
          });

        }
      }
    };

  }

}());
