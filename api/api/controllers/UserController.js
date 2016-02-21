/**
* UserController
*
* @description :: Server-side logic for managing users
* @help        :: See http://links.sailsjs.org/docs/controllers
*/

module.exports = {

  find: function(req, res, cb)
  {
    sails.models.user.find().exec(function(err, users){
      if(err) return cb(err);
      res.json(users);
    });
  },

  findWithProfile: function(req, res, cb)
  {
    sails.models.user.find().populate('profile').exec(function(err, users){
      if(err) return cb(err);
      res.json(users);
    });
  },

  findUserByToken: function(req, res, cb)
  {
    var userId = req.token.id;

    sails.models.user.findOne({ id: userId }).exec(function(err, user){
      if(err) return cb(err);
      res.json(user);
    });
  },

  create: function(req, res, cb)
  {
    var data = req.body;

    UserService.getDefaultAuthorizations(function(authorizations){
      data.authorizations = authorizations;
      // It is created user
      sails.models.user.create(data).exec(function(err, user){
        if(err) return cb(err);
        // It is created profile associated with user
        sails.models.profile.create({ user: user.id })
        .exec(function(err, profile){
          if(err) return cb(err);
          // It is associated the user with profile
          sails.models.user.update({ id: profile.user }, { profile: profile.id })
          .exec(function(err, update){
            if(err) return cb(err);

            res.json(user);
          });
        });
      });
    });
  },

  update: function(req, res, cb)
  {
    var userId = req.params.id;
    var data = req.body;

    // It is update user
    sails.models.user.update({id: userId}, data).exec(function(err, update){
      if(err) return cb(err);

      sails.models.user.findOne({id: userId}).populate('profile', data.profile).exec(function (err, user){
        if(err) return cb(err);

        res.json(user);
      });
    });
  },

  updateUsers: function(req, res, cb)
  {
    var data = req.body;

    async.each(data.ids, function(userId, callback) {

      sails.models.user.update({ id: userId }, data.values ).exec(function(err, update){
        if(err) return cb(err);
        callback();
      });

    }, function(err) {
      res.ok();
    });
  },

  updatePassword: function(req, res, cb)
  {
    var userId = req.params.id;
    var data = req.body;

    sails.models.user.findOne({id: userId}).exec(function (err, user){
      if(err) return cb(err);
      // Comparing the passwords
      EncryptService.compare(data.oldPassword, user.password, function (err, valid) {
        // If the passwords are not the same
        if(!valid) return res.badRequest();
        // It is encrypt password
        EncryptService.encrypt(data.password, function (err, hash) {
          if(err) return cb(err);
          // It is updated password
          sails.models.user.update({id: userId}, {password: hash}).exec(function(err, update){
            if(err) return cb(err);

            res.ok();
          });
        });
      });
    });
  },

  sendUserData: function(req, res, cb)
  {
    var userId = req.params.id;

    sails.models.user
    .findOne({ id: userId, active: true })
    .populate('profile').exec(function (err, user){
      if(err) return cb(err);

      if (!user) return res.notFound();

      // It is generated resetToken
      var randToken = RandTokenService.generate();

      // It is create resetToken
      sails.models.passwordreset.create({ userId: user.id, token: randToken })
      .exec(function(err, token){
        if(err) return cb(err);

        req.setLocale(user.lang);

        var options = {
          to: user.email,
          subject: req.__('send-user-data.subject'),
          data: {
            hi: req.__('hi', user.profile.fullName || user.username),
            paragraph: req.__('send-user-data.paragraph'),
            username: user.username,
            email: user.email,
            btn: req.__('password-reset.btn'),
            link: sails.config.settings.APP_URL + '/password_reset/' + token.token +'/'+ token.id +'/'+ token.userId,
            linkduration: req.__('link-duration'),
            team: req.__('team')
          }
        };

        // Its is send mail
        EmailService.send('sendUserData', options);

        res.ok();
      });
    });
  },

  chatContacts: function(req, res, cb)
  {
    var userId = req.token.id;

    // Se buscan todos los usuarios activos exepto el user que realizo la peticion
    sails.models.user.find({ id: { '!': userId }, active: true })
    .populate('profile')
    .exec(function(err, users){
      if(err) cb(err);

      var contacts = [];

      users.forEach(function(user){
        user = user.toJSON();

        contacts.push({
          id: user.id,
          name: user.profile.fullName || user.username,
          avatar: user.avatar,
          logged: user.logged
        });
      });

      res.json(contacts);
    });
  }

};
