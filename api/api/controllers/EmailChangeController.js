/**
* EmailChangeController
*
* @description :: Server-side logic for managing auth
* @help        :: See http://links.sailsjs.org/docs/controllers
*/

var moment = require('moment');

module.exports = {

  validate: function(req, res, cb){

    var token = req.params.token;
    var tokenId = req.params.tokenId;
    var userId = req.params.userId;

    // It find the token
    sails.models.emailchange.findOne({ id: tokenId, token: token, userId: userId })
    .exec(function(err, emailchange){
      if(err) return cb(err);

      // If token do not exist
      if(!emailchange) return res.notFound();

      // If token it is used
      if (emailchange.deletedAt !== null) return res.tokenExpired();

      var now = moment().format();
      var createAt24 = moment(emailchange.createdAt).add(1, 'd');

      // If the token has expired
      if (!createAt24.isAfter(now)) return res.tokenExpired();

      // It updates the user
      sails.models.user.update({ id: userId }, {email: emailchange.email})
      .exec(function(err, user){
        if(err) return cb(err);

        // It deletes token
        sails.models.emailchange.update({ id: tokenId }, { deletedAt: now })
        .exec(function(err, emailchange){
          if(err) return cb(err);

          // It find the user
          sails.models.user.findOne({ id: userId }).populate('profile')
          .exec(function(err, user){
            if(err) return cb(err);

            user = user.toJSON();
            req.setLocale(user.lang);

            var options = {
              to: user.email,
              subject: req.__("email-change-update.subject"),
              data: {
                hi: req.__('hi', user.profile.fullName || user.username),
                paragraph: req.__('email-change-update.paragraph'),
                team: req.__('team')
              }
            };

            // It send the mail
            EmailService.send('emailChangeUpdate', options);

            res.json(user);
          });

        });
      });

    });
  }

};
