
module.exports = function(req, res, next) {

  //console.log(req.isSocket);
  //console.log(req.headers);

  if (req.headers && req.headers.authorization) {

    JWTService.verify(req.headers.authorization, function(err, token) {
      //console.log(err);
      //console.log(token);
      if (err) return res.json(401, {error: 'The token is not valid'});

      req.token = token;
      // req.body.createdUser = token.id;
      // req.body.updatedUser = token.id;

      next();
    });

  }else{
    return res.json(403, {error: 'The token not exist'});
  }

};
