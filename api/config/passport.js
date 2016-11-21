var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findOne({ id: id } , function (err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy({
    usernameField: 'emailOrUsername',
    passwordField: 'password'
    },function(username, password, done) {
        // Se busca el userName o el email
        sails.models.user.findOne({
            or : [{email: username}, {username: username}],
            active: true, deletedAt: null
        }).populate('role').exec(function (err, user) {
            if (err) return done(err);

            // Si el userName o el email no existen o la cuenta esta desactivada
            if (!user) {
                return done(null, false, { status: 404 });
            }

            // Se comparan los passwords
            EncryptService.compare(password, user.password, function (err, valid) {
                // Si los passwords no son iguales
                if(!valid) return done(null, false, { status: 400 });

                return done(null, user, { status: 200 });
            });

        });
    }
));
