(function(){
	'use strict';

	angular
	.module('users')
	.controller('ProfileCtrl', ['$rootScope', '$scope', '$state', '$location', '$translate', 'restFulService', 'config', 'errorService', ProfileCtrl]);

	function ProfileCtrl($rootScope, $scope, $state, $location, $translate, restFulService, config, errorService) {

		$scope.urlAPI = config.urlAPI;
		$scope.token =  localStorage.getItem('token');

		$scope.user = {};

		$scope.formName = {};
		$scope.formPersonal = {
			birthday: null
		};
		$scope.formPlace = {};
		$scope.formFamily = {
			birthday: null
		};
		$scope.formEducation = {};
		$scope.formContact = {};
		$scope.formWork = {};
		$scope.formAccount = {};
		$scope.formPassword = {};

		$scope.editMode = {
			fullName: false,
			profile: false
		};
		$scope.show = {
			btnPlace: false,
			btnFamily: false,
			btnEducation: false,
			btnContact: false
		};

		$scope.dtp_options = {
			format: "D/MMM/YYYY",
			allowInputToggle: true
		};

		/*
		|- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
		|   Methods
		|- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
		*/
		function getUser(id){
			// Se obtiene el modelo user y el modelo profile
			restFulService.get('user/' + id)
			.then(function(response){
				$scope.user = response;
			})
			.catch(function(error){
				$location.path('/');
			});
		}

		/*
		|- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
		|   Events
		|- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
		*/
		$scope.editFullName = function()
		{
			$scope.editMode.fullName = !$scope.editMode.fullName;

			$scope.formFullName = {
				firstName: $scope.user.firstName,
				lastName: $scope.user.lastName,
			};
		};
		$scope.saveFullName = function(event)
		{
			var btn = $(event.target);
			btn.button('loading');

			restFulService.put('user/' + $scope.user.id, $scope.formFullName)
			.then(function(response){

				$scope.user.firstName = response.firstName;
				$scope.user.lastName = response.lastName;

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
				$scope.editMode.fullName = false;

			});
		};

		$scope.setPhoto = function(event, photo)
		{
			restFulService.put('user/' + $scope.user.id, {photo: photo.name})
			.then(function(response){
				$scope.user.photo = response.photo;
				$scope.user.avatar = response.avatar;
				if ($rootScope.user.id == $scope.user.id) {
					$rootScope.user.avatar = response.avatar;
				}

				$translate('MESSAGES.SUCCESS').then(function (translate) {
					$.smkAlert({
						text: translate,
						type: 'success',
						position: 'bottom-left'
					});
				});
			});
		};

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

		$scope.saveWork = function(event)
		{
			var btn = $(event.target);
			btn.button('loading');

			var data = {
				job: $scope.formWork.job.job,
				department: $scope.formWork.department.department,
				company: $scope.formWork.company.company
			};

			restFulService.put('profile/' + $scope.user.profile.id, data)
			.then(function(response){

				$scope.user.profile.job = response.job;
				$scope.user.profile.department = response.department;
				$scope.user.profile.company = response.company;

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
			});
		};

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


		/*
		|- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
		|   Watch & Calls
		|- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
		*/
		// Si se cambia la foto se actualiza la foto del rootScope
		$scope.$watch('photoUpload', function(newValue, oldValue) {
			if(newValue !== undefined && newValue !== ''){
				$scope.user.avatar = newValue.avatar;
				$scope.user.photos.push(newValue.photo);
				if ($rootScope.user.id == $scope.user.id) {
					$rootScope.user.avatar = newValue.avatar;
				}
				$('#modalPhoto').modal('hide');
			}
		});


		// Si no existe el parametro id
		if($state.params.id === '')
		$location.path('error');

		var authorizations = $rootScope.user.role.authorizations;

		if($rootScope.user.custom) {
			DeepDiff.observableDiff(authorizations,$rootScope.user.authorizations, function (d) {
				if (d.kind == 'E') {
					DeepDiff.applyChange(authorizations,$rootScope.user.authorizations, d);
				}
			});
		}

		if (authorizations.users._access) {
			$scope.editMode.profile = true;
		} else if ($rootScope.user.id == $state.params.id) {
			$scope.editMode.profile = true;
		}

		// Se cargan los datos del usuario
		getUser($state.params.id);

	}

}());
