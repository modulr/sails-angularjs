module.exports = {

  login: function(user, req)
  {
    // Parse detailed information from user-agent string
    var r = require('ua-parser').parse(req.headers['user-agent']);
    // Create new UserLogin row to database
    sails.models.loglogin.create({
      ip: req.ip,
      host: req.host,
      agent: req.headers['user-agent'],
      browser: r.ua.toString(),
      browserVersion: r.ua.toVersionString(),
      browserFamily: r.ua.family,
      os: r.os.toString(),
      osVersion: r.os.toVersionString(),
      osFamily: r.os.family,
      device: r.device.family,
      user: user.id
    })
    .exec(function(err, created) {
      if(err) sails.log(err);

      created.user = user;
      sails.models.loglogin.publishCreate(created);
    });
  },

  request: function(log, req, resp)
  {
    //var userId = -1;

    // if (req.token) {
    //   userId = req.token;
    // } else {
    //   userId = -1;
    // }

    sails.models.logrequest.create({
      ip: log.ip,
      protocol: log.protocol,
      method: log.method,
      url: log.diagnostic.url,
      headers: req.headers || {},
      parameters: log.diagnostic.routeParams,
      body: log.diagnostic.bodyParams,
      query: log.diagnostic.queryParams,
      responseTime: log.responseTime || 0,
      middlewareLatency: log.diagnostic.middlewareLatency || 0,
      user: req.token || 0
    })
    .exec(function(err, created) {
      if(err) sails.log(err);

      sails.models.logrequest.publishCreate(created);
    });
  }

};
