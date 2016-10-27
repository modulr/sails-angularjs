/**
* UserController
*
* @description :: Server-side logic for managing users
* @help        :: See http://links.sailsjs.org/docs/controllers
*/

module.exports = {

  // find: function(req, res, cb)
  // {
  //   sails.models.user.find().exec(function(err, users){
  //     if(err) return cb(err);
  //     res.json(users);
  //   });
  // },

  // findWithProfile: function(req, res, cb)
  // {
  //     sails.models.user.find().populate('profile').exec(function(err, users){
  //         if(err) return cb(err);
  //         res.json(users);
  //     });
  // },

  findUserByToken: function(req, res, cb)
  {
    var userId = req.token.id;

    sails.models.user.findOne({ id: userId }).populate('role').exec(function(err, user){
      if(err) return cb(err);
      res.json(user);
    });
  },

  findByUsernameOrFullname: function(req, res, cb)
  {
    var name = req.params.id;
    sails.models.user.find({
      or : [
        { username: { 'like': '%' + name + '%'} },
        { firstName: { 'like': '%' + name + '%'} },
        { lastName: { 'like': '%' + name + '%'} }
      ]
    }).exec(function(err, users){
      if(err) return cb(err);
      res.json(users);
    });
  },

  create: function(req, res, cb)
  {
    var data = req.body;

    //UserService.getDefaultAuthorizations(function(authorizations){
    //data.authorizations = authorizations;
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

          sails.models.user.findOne({id: update[0].id}).populate('role')
          .exec(function (err, usr){
            if(err) return cb(err);

            res.json(usr);
          });
        });
      });
    });
    //});
  },

  update: function(req, res, cb)
  {
    var userId = req.params.id;
    var data = req.body;

    // It is update user
    sails.models.user.update({id: userId}, data).exec(function(err, update){
      if(err) return cb(err);

      sails.models.user.findOne({id: userId}).populate('profile').populate('role').exec(function (err, user){
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

  updateAccount: function(req, res, cb)
  {
    var userId = req.params.id;
    var data = req.body;

    // It find the user
    sails.models.user.findOne({id: userId}).populate('profile').exec(function (err, user){
      if(err) return cb(err);

      if (user.email !== data.email) {

        // It updates the user
        sails.models.user.update({id: userId}, {username: data.username, lang: data.lang, language: data.language}).exec(function(err, update){
          if(err) return cb(err);

          // It generates the randToken
          var randToken = RandTokenService.generate();
          // It creates the token
          sails.models.emailchange.create({ userId: userId, token: randToken, email: data.email })
          .exec(function(err, token){
            if(err) return cb(err);

            user = user.toJSON();
            req.setLocale(user.lang);

            var options = {
              to: user.email,
              subject: req.__('email-change.subject'),
              data: {
                hi: req.__('hi', user.fullName || user.username),
                paragraph: req.__('email-change.paragraph'),
                paragraph2: req.__('email-change.paragraph2', user.username),
                btn: req.__('email-change.btn'),
                link: sails.config.settings.APP_URL + '/email_change/' + token.token +'/'+ token.id +'/'+ token.userId,
                linkduration: req.__('link-duration'),
                team: req.__('team')
              }
            };

            // It send the mail
            EmailService.send('emailChange', options);

            res.json({user: update[0], emailChange: true});

          });
        });

      } else {
        // It updates the user
        sails.models.user.update({id: userId}, data).exec(function(err, update){
          if(err) return cb(err);

          res.json({user: update[0], emailChange: false});
        });
      }

    });
  },

  updatePassword: function(req, res, cb)
  {
    var userId = req.params.id;
    var data = req.body;

    sails.models.user.findOne({id: userId}).populate('profile').exec(function (err, user){
      if(err) return cb(err);

      // Comparing the passwords
      EncryptService.compare(data.oldPassword, user.password, function (err, valid) {
        // If the passwords are not the same
        if(!valid) return res.badRequest();

        // Update the password
        sails.models.user.update({id: userId}, {password: data.password}).exec(function(err, update){
          if(err) return cb(err);

          user = user.toJSON();
          req.setLocale(user.lang);

          var options = {
            to: user.email,
            subject: req.__('password-update.subject'),
            data: {
              hi: req.__('hi', user.fullName || user.username),
              paragraph: req.__('password-update.paragraph'),
              team: req.__('team')
            }
          };

          // Its is send mail
          EmailService.send('passwordUpdate', options);

          res.ok();
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
    .exec(function(err, users){
      if(err) cb(err);

      var contacts = [];

      users.forEach(function(user){
        user = user.toJSON();

        contacts.push({
          id: user.id,
          name: user.fullName || user.username,
          avatar: user.avatar,
          logged: user.logged
        });
      });

      res.json(contacts);
    });
  }

};
