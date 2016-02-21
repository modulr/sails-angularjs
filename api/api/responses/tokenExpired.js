/**
 * 498 (Token Expired) Handler
 *
 * Usage:
 * return res.tokenExpired();
 * return res.tokenExpired(err);
 * return res.tokenExpired(err, 'some/specific/tokenExpired/view');
 *
 * e.g.:
 * ```
 * return res.tokenExpired();
 * ```
 *
 * NOTE:
 * If a request doesn't match any explicit routes (i.e. `config/routes.js`)
 * or route blueprints (i.e. "shadow routes", Sails will call `res.tokenExpired()`
 * automatically.
 */

module.exports = function tokenExpired (data, options) {

  // Get access to `req`, `res`, & `sails`
  var req = this.req;
  var res = this.res;
  var sails = req._sails;

  // Set status code
  res.status(498);

  // Log error to console
  if (data !== undefined) {
    sails.log.verbose('Sending 498 ("Token Expired") response: \n',data);
  }
  else sails.log.verbose('Sending 498 ("Token Expired") response');

  // Only include errors in response if application environment
  // is not set to 'production'.  In production, we shouldn't
  // send back any identifying information about errors.
  if (sails.config.environment === 'production') {
    data = undefined;
  }

  // If the user-agent wants JSON, always respond with JSON
  if (req.wantsJSON) {
    return res.jsonx(data);
  }

  // If second argument is a string, we take that to mean it refers to a view.
  // If it was omitted, use an empty object (`{}`)
  options = (typeof options === 'string') ? { view: options } : options || {};

  // If a view was provided in options, serve it.
  // Otherwise try to guess an appropriate view, or if that doesn't
  // work, just send JSON.
  if (options.view) {
    return res.view(options.view, { data: data });
  }

  // If no second argument provided, try to serve the default view,
  // but fall back to sending JSON(P) if any errors occur.
  else return res.view('498', { data: data }, function (err, html) {

    // If a view error occured, fall back to JSON(P).
    if (err) {
      //
      // Additionally:
      // • If the view was missing, ignore the error but provide a verbose log.
      if (err.code === 'E_VIEW_FAILED') {
        sails.log.verbose('res.tokenExpired() :: Could not locate view for error page (sending JSON instead).  Details: ',err);
      }
      // Otherwise, if this was a more serious error, log to the console with the details.
      else {
        sails.log.warn('res.tokenExpired() :: When attempting to render error page view, an error occured (sending JSON instead).  Details: ', err);
      }
      return res.jsonx(data);
    }

    return res.send(html);
  });

};
