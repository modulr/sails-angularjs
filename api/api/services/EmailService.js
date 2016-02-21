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
  }

  };
