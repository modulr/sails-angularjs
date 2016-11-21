(function(){
  'use strict';

  angular
  .module('chat', [])
  .controller('ChatCtrl', ['$rootScope', '$scope', 'restFulService', 'restFulSocketService', '$sailsSocket', function($rootScope, $scope, restFulService, restFulSocketService, $sailsSocket){

    $scope.chats = [];
    $scope.contacts = [];

    $scope.chat = {
      open: false,
      focus: false,
      name: null,
      avatar: '',
      logged: false,
      existMoreMessages: false,
      messages: [],
      message: {
        chatId: null,
        from: null,
        to: null,
        msg: null
      }
    };

    $scope.loaded = {
      moreMessages: false
    };

    /*
    |- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    |   Events
    |- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    */
    $scope.createChat = function(user)
    {
      var priv = 1;
      var chatExist = false;

      // Se busca el chat
      $scope.chats.forEach(function(chat, index){
        // Si el chat ya existe
        if (chat.type == priv && chat.to[0].id == user.id) {
          // Se cargan los mensajes
          $scope.loadMessages(chat, index, user);
          chatExist = true;
          return false;
        }
      });

      // Si el chat no existe
      if (!chatExist) {
        var participants = [$rootScope.user.id, user.id];
        // Se crea el chat en la base de datos
        restFulService.post('chat/createPrivate', participants)
        .then(function(response){
          // Se agrega el chat al array chats
          $scope.chats.unshift(response.data);
          // Se cargan los mensajes
          $scope.loadMessages(response.data, 0, user);
        });
      }
    };

    $scope.loadMessages = function(chat, index, user)
    {
      $scope.chat.index = index;
      $scope.chat.name = chat.to[0].name;
      $scope.chat.avatar = user.avatar;
      $scope.contacts.forEach(function(contact){
        if (contact.id == chat.to[0].id) {
          $scope.chat.logged = contact.logged;
        }
      });
      $scope.chat.message.chatId = chat.id;
      $scope.chat.message.from = $rootScope.user.id;
      $scope.chat.message.to = [{userId: chat.to[0].id, read:false}];

      // Se obtienen los mensajes del chat no leidos mas otros mas
      restFulSocketService.post('chatMessage/messages', { id: chat.id, userId: $rootScope.user.id, noRead: chat.noRead })
      .then(function(response){

        $scope.chats[index].lastMessages = response.data;
        $scope.chat.messages = response.data;

        if (response.data.length == 15) {
          $scope.chat.existMoreMessages = true;
        } else {
          $scope.chat.existMoreMessages = false;
        }

        $scope.chat.open = true;
        $scope.chat.focus = true;

      });
    };

    $scope.loadMoreMessages = function()
    {
      $scope.loaded.moreMessages = true;
      // Se obtienen mas mensajes del chat seleccionado
      restFulSocketService.post('chatMessage/moremessages', { id: $scope.chat.message.chatId, skip: $scope.chat.messages.length })
      .then(function(response){
        if (response.data.length) {
          $scope.chat.messages = $scope.chat.messages.concat(response.data);
        } else {
          $scope.chat.existMoreMessages = false;
        }

        $scope.loaded.moreMessages = false;

      });

    };

    $scope.sendMesssage = function()
    {
      if ($scope.chat.message.msg !== null && $scope.chat.message.msg !== '') {
        restFulSocketService.post('chatMessage/create', $scope.chat.message)
        .then(function(response){
          $scope.chat.messages.unshift(response.data);
          $scope.chat.message.msg = null;
        });
      }
      $scope.chat.focus = true;
    };

    $scope.clearMessages = function()
    {
      $scope.chat.name = null;
      $scope.chat.avatar = null;
      $scope.chat.logged = false;
      $scope.chat.message.chatId = null;
      $scope.chat.message.to = null;
      $scope.chat.messages = [];
      $scope.chat.focus = false;
      $scope.chat.open = false;
    };

    $scope.markReadMessages = function()
    {
      if ($scope.chats[$scope.chat.index].noRead > 0) {
        // Se marcan los mensajes como leidos
        restFulSocketService.post('chatMessage/markRead', { id: $scope.chat.message.chatId, userId: $rootScope.user.id })
        .then(function(response){
          $scope.chats[$scope.chat.index].noRead = 0;
          $scope.$parent.notifications.chat--;
        });
      }
    };

    /**
    * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    * Methods
    * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    */
    function getChats()
    {
      restFulSocketService.get('chat/chats')
      .then(function (response) {
        $scope.chats = response.data;
        $scope.$parent.notifications.chat = response.notifications;
      });
    }

    function getChat(chatId)
    {
      restFulSocketService.get('chat/chat/' + chatId)
      .then(function (response) {
        $scope.chats.push(response.data);
        $scope.$parent.notifications.chat++;
      });
    }

    function getChatContacts()
    {
      restFulSocketService.get('user/chatContacts')
      .then(function (response) {
        $scope.contacts = response;
      });
    }

    function play()
    {
      $("#audio")[0].play();
    }

    /**
    * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    * Watch
    * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    */
    $rootScope.$watch('user', function(newValue, oldValue) {
      if (newValue) {
        getChats();
        getChatContacts();
      }
    });

    // Se escucha el evento user_logged es el que nos avisa si un usuario se conecta o se desconecta
    $sailsSocket.subscribe('user_logged', function(response){
      // Se busca el id del usuario que se conecto o desconecto
      $scope.contacts.forEach(function(v) {
        if (v.id == response.id) {
          // Se actualiza el status(logged) del usuario
          v.logged = response.logged;
          // Si el usuario con el que se esta platicando se conecto o desconecto
          if ($scope.chat.message.to[0].userId == response.id) {
            // Se se actualiza el el status(logged) del usuario
            $scope.chat.logged = response.logged;
          }
          return false;
        }
      });

    });

    $sailsSocket.subscribe('privateMessage', function(response){

      var chatExist = false;

      // Si existen chats
      if ($scope.chats.length) {
        // Se suma la notificacion al chat que nos envio el mensaje
        $scope.chats.forEach(function(chat) {
          // Si el chat existe
          if (chat.id == response.data.chatId) {
            // Se inserta el mensaje en lastMessages
            chat.lastMessages.unshift(response.data);
            // Se suman un mensaje no leido
            chat.noRead++;
            // Si es el primer mensaje no leido
            if (chat.noRead<=1) {
              // Se suma un chat no leido a las notificaciones globales
              $scope.$parent.notifications.chat++;
            }
            chatExist = true;
            return false;
          }
        });

        // Si el chat no existe
        if (!chatExist) {
          // Se obtiene el chat y se agrega en chats
          getChat(response.data.chatId);
        }
        // Si no existen chats
      } else {
        // Se obtiene el chat y se agrega en chats
        getChat(response.data.chatId);
      }

      play();
    });

  }]);

}());
