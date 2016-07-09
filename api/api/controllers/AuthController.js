/**
* AuthController
*
* @description :: Server-side logic for managing auth
* @help        :: See http://links.sailsjs.org/docs/controllers
*/

var passport = require('passport');
var moment = require('moment');

module.exports = {

    login: function(req, res, cb)
    {
        passport.authenticate('local', function(err, user, info) {
            if (err) return cb(err);

            if (!user) return res.json(info.status, {});

            req.login(user, function(err) {
                if (err) return cb(err);

                // Duracion en minutos del token default 24hrs
                var expires = sails.config.settings.TOKEN_EXPIRES_IN_MINUTES;

                // Si se requiere remember-me
                if(req.body.rememberMe == 'true'){
                    // Duracion en minutos del token default 30 dias
                    expires = sails.config.settings.REMEMBER_TOKEN_EXPIRES_IN_MINUTES;
                }

                // Se genera el authToken
                var token = JWTService.issue(user.id, expires);

                // Se genera el log del login en la DB
                LogService.login(user, req);

                // Se actualiza el status connect a true en la DB y se notifica a todos los sockets
                UserService.chatUserLogged(user.id, true, req);

                return res.json({ token: token, user: user });

            });

        })(req, res);
    },

    logout: function(req, res)
    {
        var userId = req.token.id;
        req.logout();

        // Se actualiza el status connect a true en la DB y se notifica a todos los sockets
        UserService.chatUserLogged(userId, false, req);

        return res.ok();
    },

    signup: function(req, res, cb)
    {
        var data = req.body;

        // UserService.getDefaultAuthorizations(function(authorizations){
        //    data.authorizations = authorizations;
            data.role = '56f964859093205f3a5fedb7';
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

                        // It is generated randToken
                        var randToken = RandTokenService.generate();
                        // It is create token
                        sails.models.confirmemail.create({ userId: user.id, token: randToken })
                        .exec(function(err, token){
                            if(err) return cb(err);

                            req.setLocale(user.lang);

                            var options = {
                                to: user.email,
                                subject: req.__("signup.subject"),
                                data: {
                                    hi: req.__('hi', user.username),
                                    paragraph: req.__('signup.paragraph'),
                                    btn: req.__('signup.btn'),
                                    link: sails.config.settings.APP_URL + '/confirm_email/' + token.token +'/'+ token.id +'/'+ token.userId,
                                    team: req.__('team')
                                }
                            };

                            EmailService.send('confirmEmail', options);

                            res.ok();
                        });
                    });
                });
            });
        // });
    },

    confirmEmail: function(req, res, cb){

        var token = req.params.token;
        var tokenId = req.params.tokenId;
        var userId = req.params.userId;

        sails.models.confirmemail.findOne({ id: tokenId, token: token, userId: userId })
        .exec(function(err, confirmemail){
            if(err) return cb(err);

            // If token do not exist
            if(!confirmemail) return res.notFound();

            // If token it is used
            if (confirmemail.deletedAt !== null) return res.found();

            var now = moment().format();

            sails.models.user.update({ id: userId }, { active: true })
            .exec(function(err, user){
                if(err) return cb(err);

                sails.models.confirmemail.update({ id: tokenId }, { deletedAt: now })
                .exec(function(err, confirmemail){
                    if(err) return cb(err);

                    req.setLocale(user[0].lang);

                    var options = {
                        to: user[0].email,
                        subject: req.__("welcome.subject"),
                        data: {
                            hi: req.__('hi', user[0].username),
                            paragraph: req.__('welcome.paragraph'),
                            team: req.__('team')
                        }
                    };

                    EmailService.send('welcome', options);

                    res.ok();
                });
            });

        });
    },

    findAccount: function(req, res, cb)
    {
        var emailOrUsername = req.params.emailOrUsername;

        sails.models.user.findOne({
            or : [{ email: emailOrUsername }, {username: emailOrUsername }],
            active: true, deletedAt: null
        })
        .populate('profile').exec(function (err, user){
            if(err) return cb(err);

            if (!user) return res.notFound();
            res.json(user);
        });
    },

    createPasswordReset: function(req, res, cb){

        var userId = req.params.id;

        sails.models.user.findOne({ id: userId, active: true, deletedAt: null })
        .populate('profile').exec(function (err, user){
            if(err) return cb(err);

            if (!user) return res.notFound();

            var now = moment().format();

            sails.models.passwordreset.update({ userId: userId,  deletedAt: null }, { deletedAt: now }).exec(function (err, update){
                if(err) return cb(err);

                req.setLocale(user.lang);
                // It is generated randToken
                var randToken = RandTokenService.generate();
                // It is create token
                sails.models.passwordreset.create({ userId: userId, token: randToken })
                .exec(function(err, token){
                    if(err) return cb(err);

                    user = user.toJSON();
                    req.setLocale(user.lang);

                    var options = {
                        to: user.email,
                        subject: req.__('password-reset.subject'),
                        data: {
                            hi: req.__('hi', user.profile.fullName || user.username),
                            paragraph: req.__('password-reset.paragraph'),
                            paragraph2: req.__('password-reset.paragraph2', user.username),
                            btn: req.__('password-reset.btn'),
                            link: sails.config.settings.APP_URL + '/password_reset/' + token.token +'/'+ token.id +'/'+ token.userId,
                            linkduration: req.__('link-duration'),
                            team: req.__('team')
                        }
                    };

                    // Its is send mail
                    EmailService.send('passwordReset', options);

                    res.ok();
                });
            });
        });

    },

    findPasswordReset: function(req, res, cb){

        var token = req.params.token;
        var tokenId = req.params.tokenId;
        var userId = req.params.userId;

        sails.models.passwordreset.findOne({ id: tokenId, token: token, userId: userId })
        .exec(function(err, passwordReset){
            if(err) return cb(err);

            // If the token do not exist
            if(!passwordReset) return res.notFound();

            // If token it is used
            if (passwordReset.deletedAt !== null) return res.found();

            var now = moment();
            var createAt24 = moment(passwordReset.createdAt).add(1, 'd');

            // If the token has expired
            if (!createAt24.isAfter(now)) return res.tokenExpired();

            res.ok();
        });
    },

    passwordReset: function(req, res, cb)
    {
        var userId = req.params.id;
        var data = req.body;

        // It is update the password
        sails.models.user.update({ id: userId }, { password: data.password }).exec(function(err, update){
            if(err) return cb(err);

            var now = moment().format();

            sails.models.passwordreset.update({ userId: userId,  deletedAt: null }, { deletedAt: now }).exec(function (err, update){
                if(err) return cb(err);

                sails.models.user.findOne({ id: userId, active: true, deletedAt: null })
                .populate('profile').exec(function (err, user){
                    if(err) return cb(err);

                    user = user.toJSON();
                    req.setLocale(user.lang);

                    var options = {
                        to: user.email,
                        subject: req.__('password-update.subject'),
                        data: {
                            hi: req.__('hi', user.profile.fullName || user.username),
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
    }

};
