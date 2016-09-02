/**
* Development environment settings
*
* This file can include shared settings for a development team,
* such as API keys or remote database passwords.  If you're using
* a version control solution for your Sails app, this file will
* be committed to your repository unless you add it to your .gitignore
* file.  If your repository will be publicly viewable, don't add
* any private information to this file!
*
*/

module.exports = {

  /***************************************************************************
  * Set the default database connection for models in the development       *
  * environment (see config/connections.js and config/models.js )           *
  ***************************************************************************/

  settings: {
    APP_URL: 'http://localhost:3000',
    //IMAGES_URL: '../app/images',
    STORAGE: '../app/storage',
    TOKEN_SECRET: 'shhhhh',
    TOKEN_EXPIRES_IN_MINUTES: 1440, // 1 dia
    REMEMBER_TOKEN_EXPIRES_IN_MINUTES: 43200, // 30 dias
  },

  email: {
    transporter: {
      host: 'p3plcpnl0565.prod.phx3.secureserver.net',
      port: 465,
      secure: true, // use SSL
      auth: {
        user: 'no-reply@modulr.io',
        pass: '0pensourcE10'
      }
    },
    from: 'Modulr <no-reply@modulr.io>',
    testMode: false
  },

  connections: {
    mongo: {
      adapter: 'sails-mongo',
      host: 'localhost',
      port: 27017,
      // user: 'username',
      // password: 'password',
      database: 'modulr',
      socketOptions: {
        noDelay: true,
        connectTimeoutMS: 0,
        socketTimeoutMS: 0
      }
    }
  },

  models: {
    connection: 'mongo',
    migrate: 'alter'
  },

  cors: {
    allRoutes: true,
    headers: 'content-type, access-control-allow-origin, authorization'
  },

  globals: {
    models: false
  },

  sockets: {
    transports: [
      'websocket'
      // 'htmlfile',
      // 'polling'
    ]
  //   origins: '*:*'
  }

};
