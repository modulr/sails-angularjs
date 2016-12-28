module.exports = {

  /**
  * @param template {String}
  * @param options {Object}
  */
  send: function(template, options){
    sails.hooks.email.send(template, options,
      {
        to: options.to,
        subject: options.subject,
      },
      function(err) {console.log(err || "It worked!");}
      // function(err) {
      //   if(err) return err;
      // }
    );
  },

  sendSimple: function(template, options, req){

    sails.models.user.findOne({ id: options.to })
    .exec(function(err, user){

      req.setLocale(user.lang);

      options.email = user.email;
      options.name = user.fullName || user.username;
      options.data.hi = req.__('hi', options.name);
      options.data.team = req.__('team');

      options.data.paragraph2 = (options.data.paragraph2) ? options.data.paragraph2 : '';
      options.data.paragraph3 = (options.data.paragraph3) ? options.data.paragraph3 : '';
      options.data.paragraph4 = (options.data.paragraph4) ? options.data.paragraph4 : '';

      sails.hooks.email.send(template, options,
        {
          to: options.email,
          subject: options.subject
        },
        function(err) {console.log(err || "It worked!");}
        // function(err) {
        //   if(err) return err;
        // }
      );
    });
  }

  };
