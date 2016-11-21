(function(){
  'use strict';

  angular
  .module('auth')
  .controller('SignupCtrl', ['$scope', '$translate', 'sanitizeService', 'restFulService', 'errorService', function($scope, $translate, sanitizeService, restFulService, errorService){

    $scope.formSignup = {};
    $scope.show = {
      message: false
    };

    $scope.signup = function(event){

      $('#formSignup').removeClass('animated shake');

      if ($('#formSignup').smkValidate()) {
        if( $.smkEqualPass('#formSignup #password', '#formSignup #rePassword') ){

          var btn = $(event.target);
          btn.button('loading');

          var data = sanitizeService.array($scope.formSignup);

          data.lang = localStorage.getItem('NG_TRANSLATE_LANG_KEY');

          restFulService.post('auth/signup', data)
          .then(function(response){

            $scope.show.message = true;

          })
          .catch(function(err){
            console.log(err);
            if (err.status == 500) {
              $('#formSignup').addClass('animated shake');

              var value = errorService.getRawMessageValue(err.error.raw.message);

              $translate('SIGNUP.MESSAGES.ERROR', { emailOrUsername: value }).then(function (translate) {
                $.smkAlert({
                  text: translate,
                  type: 'warning'
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

  }]);

}());
