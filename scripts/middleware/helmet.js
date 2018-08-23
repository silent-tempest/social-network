'use strict';

let helmet = require( 'helmet' );

module.exports = helmet( {
  // Content-Security-Policy: default-src 'self'
  contentSecurityPolicy: {
    directives: {
      'default-src': [ "'self'" ]
    }
  },

  // X-Frame-Options: DENY
  frameguard: {
    action: 'deny'
  },

  // this is not express that have X-Powered-By enabled by default.
  hidePoweredBy: false
} );
