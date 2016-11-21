(function(){
  'use strict';

  angular
  .module('users')
  .controller('ProfileInformationCtrl', ['$scope', '$translate', 'restFulService', ProfileInformationCtrl]);

  function ProfileInformationCtrl($scope, $translate, restFulService) {

    $scope.formPersonal = {};
    $scope.formPlace = {};
    $scope.formFamily = {};
    $scope.formEducation = {};
    $scope.formContact = {};

    $scope.dtp_options = {
      format: "D/MMM/YYYY",
      allowInputToggle: true
    };


    /*
    |- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    |   Events
    |- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    */
    $scope.editPersonal = function()
    {
      $scope.formPersonal = {
        gender: $scope.user.profile.gender,
        birthday:  moment($scope.user.profile.birthday),
        relationship: $scope.user.profile.relationship
      };

      $('#modalPersonal').modal('show');
    };
    $scope.savePersonal = function(event)
    {
      var btn = $(event.target);
      btn.button('loading');

      $scope.formPersonal.gender = $scope.formPersonal.gender.gender;
      $scope.formPersonal.relationship = $scope.formPersonal.relationship.relationship;

      restFulService.put('profile/' + $scope.user.profile.id, $scope.formPersonal)
      .then(function(response){

        $scope.user.profile.gender = response.gender;
        $scope.user.profile.birthday = response.birthday;
        $scope.user.profile.relationship = response.relationship;

        $translate('MESSAGES.SUCCESS').then(function (translate) {
          $.smkAlert({
            text: translate,
            type: 'success',
            position: 'bottom-left'
          });
        });
      })
      .finally(function(){
        btn.button('reset');
        $('#modalPersonal').modal('hide');
        $scope.formPersonal = {};
        $scope.formPersonal.birthday = null;
      });
    };

    $('#modalPlace').on('show.bs.modal', function (e) {
      if (!$scope.$$phase) {
        $scope.$apply(function() {
          $scope.formPlace.currently = true;
        });
      }
    });
    $scope.createPlace = function(event)
    {
      if ($('#formPlace').smkValidate()) {
        var btn = $(event.target);
        btn.button('loading');

        $scope.formPlace.userId = $scope.user.id;

        restFulService.post('place', $scope.formPlace)
        .then(function(response){

          $scope.user.place.push(response);

          $translate('MESSAGES.SUCCESS').then(function (translate) {
            $.smkAlert({
              text: translate,
              type: 'success',
              position: 'bottom-left'
            });
          });
        })
        .finally(function(){
          btn.button('reset');
          $('#modalPlace').modal('hide');
        });
      }
    };
    $scope.editPlace = function(item, index)
    {
      $scope.show.btnPlace = true;
      $scope.formPlace = {
        index: index,
        id: item.id,
        adress: item.adress,
        currently: item.currently,
      };
      $('#modalPlace').modal('show');
    };
    $scope.savePlace = function(event)
    {
      if ($('#formPlace').smkValidate()) {
        var btn = $(event.target);
        btn.button('loading');

        restFulService.put('place/' + $scope.formPlace.id, $scope.formPlace)
        .then(function(response){

          $scope.user.place[$scope.formPlace.index] = response;

          $translate('MESSAGES.SUCCESS').then(function (translate) {
            $.smkAlert({
              text: translate,
              type: 'success',
              position: 'bottom-left'
            });
          });
        })
        .finally(function(){
          btn.button('reset');
          $('#modalPlace').modal('hide');
        });
      }
    };
    $scope.deletePlace = function(event)
    {
      var btn = $(event.target);
      btn.button('loading');

      restFulService.delete('place/' + $scope.formPlace.id)
      .then(function(response){

        $scope.user.place.splice($scope.formPlace.index, 1);

        $translate('MESSAGES.SUCCESS').then(function (translate) {
          $.smkAlert({
            text: translate,
            type: 'success',
            position: 'bottom-left'
          });
        });
      })
      .finally(function(){
        btn.button('reset');
        $('#modalPlace').modal('hide');
      });
    };
    $('#modalPlace').on('hidden.bs.modal', function (e) {
      if (!$scope.$$phase) {
        $scope.$apply(function() {
          $scope.show.btnPlace = false;
          $scope.formPlace = {};
          $scope.formPlace.currently = true;
        });
      }
    });

    $scope.createFamily = function(event)
    {
      if ($('#formFamily').smkValidate()) {
        var btn = $(event.target);
        btn.button('loading');

        $scope.formFamily.userId = $scope.user.id;
        $scope.formFamily.relation = $scope.formFamily.relation.relation;

        restFulService.post('family', $scope.formFamily)
        .then(function(response){

          $scope.user.family.push(response);

          $translate('MESSAGES.SUCCESS').then(function (translate) {
            $.smkAlert({
              text: translate,
              type: 'success',
              position: 'bottom-left'
            });
          });
        })
        .finally(function(){
          btn.button('reset');
          $('#modalFamily').modal('hide');
        });
      }
    };
    $scope.editFamily = function(item, index)
    {
      $scope.show.btnFamily = true;
      $scope.formFamily = {
        index: index,
        id: item.id,
        name: item.name,
        birthday:  moment(item.birthday),
        relation: item.relation
      };
      $scope.formFamily.index = index;
      $('#modalFamily').modal('show');
    };
    $scope.saveFamily = function(event)
    {
      if ($('#formFamily').smkValidate()) {
        var btn = $(event.target);
        btn.button('loading');

        $scope.formFamily.relation = $scope.formFamily.relation.relation;

        restFulService.put('family/' + $scope.formFamily.id, $scope.formFamily)
        .then(function(response){

          $scope.user.family[$scope.formFamily.index] = response;

          $translate('MESSAGES.SUCCESS').then(function (translate) {
            $.smkAlert({
              text: translate,
              type: 'success',
              position: 'bottom-left'
            });
          });
        })
        .finally(function(){
          btn.button('reset');
          $('#modalFamily').modal('hide');
        });
      }
    };
    $scope.deleteFamily = function(event)
    {
      var btn = $(event.target);
      btn.button('loading');

      restFulService.delete('family/' + $scope.formFamily.id)
      .then(function(response){

        $scope.user.family.splice($scope.formFamily.index, 1);

        $translate('MESSAGES.SUCCESS').then(function (translate) {
          $.smkAlert({
            text: translate,
            type: 'success',
            position: 'bottom-left'
          });
        });
      })
      .finally(function(){
        btn.button('reset');
        $('#modalFamily').modal('hide');
      });
    };
    $('#modalFamily').on('hidden.bs.modal', function (e) {
      if (!$scope.$$phase) {
        $scope.$apply(function() {
          $scope.show.btnFamily = false;
          $scope.formFamily = {};
          $scope.formFamily.birthday = null;
        });
      }
    });

    $scope.createContact = function(event)
    {
      if ($('#formContact').smkValidate()) {
        var btn = $(event.target);
        btn.button('loading');

        $scope.formContact.userId = $scope.user.id;
        $scope.formContact.type = $scope.formContact.type.type;

        restFulService.post('contact', $scope.formContact)
        .then(function(response){

          $scope.user.contact.push(response);

          $translate('MESSAGES.SUCCESS').then(function (translate) {
            $.smkAlert({
              text: translate,
              type: 'success',
              position: 'bottom-left'
            });
          });
        })
        .finally(function(){
          btn.button('reset');
          $('#modalContact').modal('hide');
        });
      }
    };
    $scope.editContact = function(item)
    {
      $scope.show.btnContact = true;
      $scope.formContact = angular.copy(item);
      $scope.formContact.index = $scope.user.contact.indexOf(item);
      $('#modalContact').modal('show');
    };
    $scope.saveContact = function(event)
    {
      if ($('#formContact').smkValidate()) {
        var btn = $(event.target);
        btn.button('loading');

        $scope.formContact.type = $scope.formContact.type.type;

        restFulService.put('contact/' + $scope.formContact.id, $scope.formContact)
        .then(function(response){

          $scope.user.contact[$scope.formContact.index] = response;

          $translate('MESSAGES.SUCCESS').then(function (translate) {
            $.smkAlert({
              text: translate,
              type: 'success',
              position: 'bottom-left'
            });
          });
        })
        .finally(function(){
          btn.button('reset');
          $('#modalContact').modal('hide');
        });
      }
    };
    $scope.deleteContact = function(event)
    {
      var btn = $(event.target);
      btn.button('loading');

      restFulService.delete('contact/' + $scope.formContact.id)
      .then(function(response){

        $scope.user.contact.splice($scope.formContact.index, 1);

        $translate('MESSAGES.SUCCESS').then(function (translate) {
          $.smkAlert({
            text: translate,
            type: 'success',
            position: 'bottom-left'
          });
        });
      })
      .finally(function(){
        btn.button('reset');
        $('#modalContact').modal('hide');
      });
    };
    $('#modalContact').on('hidden.bs.modal', function (e) {
      if (!$scope.$$phase) {
        $scope.$apply(function() {
          $scope.show.btnContact = false;
          $scope.formContact = {};
        });
      }
      $('#formContact').smkClear();
    });

    $scope.createEducation = function(event)
    {
      if ($('#formEducation').smkValidate()) {
        var btn = $(event.target);
        btn.button('loading');

        $scope.formEducation.userId = $scope.user.id;

        restFulService.post('education', $scope.formEducation)
        .then(function(response){

          $scope.user.education.push(response);

          $translate('MESSAGES.SUCCESS').then(function (translate) {
            $.smkAlert({
              text: translate,
              type: 'success',
              position: 'bottom-left'
            });
          });
        })
        .finally(function(){
          btn.button('reset');
          $('#modalEducation').modal('hide');
        });
      }
    };
    $scope.editEducation = function(item, index)
    {
      $scope.show.btnEducation = true;
      $scope.formEducation = angular.copy(item);
      $scope.formEducation.index = index;
      $('#modalEducation').modal('show');
    };
    $scope.saveEducation = function(event)
    {
      if ($('#formEducation').smkValidate()) {
        var btn = $(event.target);
        btn.button('loading');

        var id = $scope.formEducation.id;
        $scope.formEducation.id = undefined;

        restFulService.put('education/' + id, $scope.formEducation)
        .then(function(response){

          $scope.user.education[$scope.formEducation.index] = response;

          $translate('MESSAGES.SUCCESS').then(function (translate) {
            $.smkAlert({
              text: translate,
              type: 'success',
              position: 'bottom-left'
            });
          });
        })
        .finally(function(){
          btn.button('reset');
          $('#modalEducation').modal('hide');
        });
      }
    };
    $scope.deleteEducation = function(event)
    {
      var btn = $(event.target);
      btn.button('loading');

      restFulService.delete('education/' + $scope.formEducation.id)
      .then(function(response){

        $scope.user.education.splice($scope.formEducation.index, 1);

        $translate('MESSAGES.SUCCESS').then(function (translate) {
          $.smkAlert({
            text: translate,
            type: 'success',
            position: 'bottom-left'
          });
        });
      })
      .finally(function(){
        btn.button('reset');
        $('#modalEducation').modal('hide');
      });
    };
    $('#modalEducation').on('hidden.bs.modal', function (e) {
      if (!$scope.$$phase) {
        $scope.$apply(function() {
          $scope.show.btnEducation = false;
          $scope.formEducation = {};
        });
      }
      $('#formEducation').smkClear();
    });

  }

}());
