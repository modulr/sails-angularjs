(function(){
    'use strict';

    angular
    .module('auth')
    .factory('authService', [function(){

        return{

            isAuthenticated: function(){
                
                if (localStorage.getItem('token')) {
                    return true;
                }

                return false;

            }

        };

    }]);

}());
