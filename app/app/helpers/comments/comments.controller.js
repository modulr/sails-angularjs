(function(){
    'use strict';

    angular.module('helpers')
    .filter('nl2br', function() {
        return function(data) {
            if (!data) return data;
            return data.replace(/\n\r?/g, '<br />');
        };
    })
    .controller('CommentsCtrl', CommentsCtrl);

    CommentsCtrl.$inject = ['$scope', '$element', '$attrs', 'nl2brFilter', 'restful'];
    function CommentsCtrl($scope, $element, $attrs, nl2brFilter, restful){

        $scope.collection = [];
        $scope.count = {
            to: 0,
            total: 0
        };

        $scope.search = null;
        $scope.orders = [ {value: 'desc', label: 'Nuevos'}, {value: 'asc', label: 'Viejos'}];
        $scope.selectOrder = $scope.orders[0];
        $scope.text = '';

        $scope.btnDisabled = true;
        $scope.divGetMore = false;

        $scope.formEdit = {};

        /**
        * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        * Events
        * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        */
        $scope.orderComments = function()
        {
            $scope.src.order = $scope.selectOrder.value;
            $scope.collection = getColeccion($scope.src);
        };
        $scope.addComment = function(event) {

            if ($('#formCommentId_' + $scope.$id).smkValidate()) {

                var btn = $(event.target);
                btn.button('loading');

                var model = createModel($scope.text);

                restful.post('comentario', model)
                .then(function(datos) {
                    if ($scope.selectOrder.value == 'desc'){
                        $scope.collection.unshift(datos);
                    } else {
                        $scope.collection.push(datos);
                    }
                    $scope.count.to++;
                    $scope.count.total++;
                    $.smkAlert({
                        text: 'El comentario se creo correctamente',
                        type: 'success'
                    });
                })
                .catch(function(error) {
                    $.smkAlert({
                        text: 'No se pudo crear el comentario, inténtalo de nuevo.',
                        type: 'danger'
                    });
                })
                .finally(function() {
                    $scope.text = '';
                    btn.button('reset');
                });
            }
        };

        $scope.addCommentReply = function(event, comment, index) {

            if ($('#formCommentReplyId_' + comment.id).smkValidate()) {

                var btn = $(event.target);
                btn.button('loading');

                var model = createModel(comment);

                restful.post('comentario', model)
                .then(function(datos) {

                    if ($scope.collection[index].children === undefined) {
                        $scope.collection[index].children = [];
                        $scope.collection[index].count = 0;
                    }
                    if ($scope.selectOrder.value == 'desc'){
                        $scope.collection[index].children.unshift(datos);
                    } else {
                        $scope.collection[index].children.push(datos);
                    }
                    $scope.collection[index].count++;
                    $.smkAlert({
                        text: 'El comentario se creo correctamente',
                        type: 'success'
                    });
                })
                .catch(function(error) {
                    $.smkAlert({
                        text: 'No se pudo crear el comentario, inténtalo de nuevo.',
                        type: 'danger'
                    });
                })
                .finally(function() {
                    comment.text = '';
                    btn.button('reset');
                    $('#collapseId_' + comment.id).collapse('hide');
                });
            }
        };

        $scope.editComment = function(comment, index) {
            $('#myModalEdit_' + $scope.$id).modal('show');
            $scope.formEdit.index = index;
            $scope.formEdit.id = comment.id;
            $scope.formEdit.comment = comment.comentario;
        };

        $scope.updateComment = function(event) {

            if ($('#formEdit_' + $scope.$id).smkValidate()) {

                var btn = $(event.target);
                btn.button('loading');

                restful.put('comentario/' + $scope.formEdit.id, {comentario: $scope.formEdit.comment})
                .then(function(datos) {

                    if (datos.parent_id === null) {
                        $scope.collection[$scope.formEdit.index].comentario = datos.comentario;
                        $scope.collection[$scope.formEdit.index].updated_at = datos.updated_at;
                    } else {
                        $scope.collection.forEach(function(val, key){
                            if (val.id === datos.parent_id){
                                val.children[$scope.formEdit.index] = datos;
                                return false;
                            }
                        });
                    }

                    $.smkAlert({
                        text: 'El comentario se edito correctamente',
                        type: 'success'
                    });
                })
                .catch(function(error) {
                    $.smkAlert({
                        text: 'No se pudo editar el comentario, inténtalo de nuevo.',
                        type: 'danger'
                    });
                })
                .finally(function() {
                    btn.button('reset');
                    $scope.formEdit = {};
                    $('#myModalEdit_' + $scope.$id).modal('hide');
                });
            }
        };

        $scope.deleteComment = function(event) {

                var btn = $(event.target);
                btn.button('loading');

                restful.delete('comentario/' + $scope.formEdit.id)
                .then(function(datos) {

                    if (datos.parent_id === null) {
                        $scope.collection.splice([$scope.formEdit.index], 1);
                        $scope.count.to--;
                        $scope.count.total--;
                    } else {
                        $scope.collection.forEach(function(val, key){
                            if (val.id === datos.parent_id){
                                val.children.splice([$scope.formEdit.index], 1);
                                val.count--;
                                return false;
                            }
                        });
                    }

                    $.smkAlert({
                        text: 'El comentario se elimino correctamente',
                        type: 'success'
                    });
                })
                .catch(function(error) {
                    $.smkAlert({
                        text: 'No se pudo elimino el comentario, inténtalo de nuevo.',
                        type: 'danger'
                    });
                })
                .finally(function() {
                    btn.button('reset');
                    $scope.formEdit = {};
                    $('#myModalEdit_' + $scope.$id).modal('hide');
                });
        };

        $scope.getMoreComments = function(event){
            var params = angular.copy($scope.src);
            params.skip = $scope.count.to;

            // Se traen mas comentarios
            restful.post('comentario/getList', params)
            .then(function (datos) {
                datos.data.forEach(function(val) {
                    $scope.collection.push(val);
                });
                $scope.count.to = $scope.count.to + datos.to;
            });
        };

        $scope.getReplies = function(event, comment){
            var params = angular.copy($scope.src);
            params.parent_id = comment.id;
            params.take = comment.count;

            if (comment.children === undefined) {
                // Se traen mas comentarios
                restful.post('comentario/getList', params)
                .then(function (datos) {
                    comment.children = datos.data;
                });
            }
        };

        /**
        * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        * Methods
        * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        */
        function getColeccion(src){
            // Se consultan los primeros comentarios
            restful.post('comentario/getList', src)
            .then(function (datos) {
                if(datos){
                    $scope.collection = datos.data;
                    $scope.count.to = datos.to;
                    $scope.count.total = datos.total;
                }
            });
        }

        function createModel(comment){
            var model = angular.copy($scope.src);
            model.comentario = comment;
            model.usuario_crea = $scope.user.id;
            model.usuario_actualiza = $scope.user.id;
            // Si el comentario es un reply
            if(comment.id !== undefined){
                model.parent_id = comment.id;
                model.comentario = comment.text;
            }
            return model;
        }

        /**
        * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        * Watch
        * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        */
        // Se cargan los comentarios segun el submodulo_id, seccion_id, item_id
        $scope.$watch('src', function(nuevoValor, viejoValor) {
            if (nuevoValor !== undefined) {
                getColeccion(nuevoValor);
            }
        });
        // Si existe usuario se activa el boton para comentar
        $scope.$watch('user', function(nuevoValor, viejoValor) {
            if (nuevoValor !== undefined) {
                $scope.btnDisabled = false;
            }
        });
        // Se muestra divGetMore si existen mas comentarios de los que se ven si no se oculta
        $scope.$watch('count.to', function(nuevoValor, viejoValor) {
            if (nuevoValor !== undefined) {
                if(nuevoValor < $scope.count.total){
                    $scope.divGetMore =  true;
                }else{
                    $scope.divGetMore = false;
                }
            }
        });
        // Se busca en el server
        $scope.$watch('search', function(nuevoValor, viejoValor) {
            var params = angular.copy($scope.src);

            if (nuevoValor !== undefined && nuevoValor !== null && nuevoValor !== '') {
                if ($scope.src !== undefined) {
                    params.comentario = $scope.search;
                    getColeccion(params);
                }
            }
        });

    }

})();
