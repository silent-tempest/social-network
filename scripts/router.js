'use strict';

const helmet = require( 'helmet' );
const Router = require( './lib/Router' );

const router = new Router()
  .set( 'view engine', require( './engine' ) )
  .use( require( './middleware/parse-query' ) )
  .use( helmet( {
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

    // It is not express that have X-Powered-By enabled by default.
    hidePoweredBy: false
  } ) )
  .use( require( './lib/static' )( 'static' ) )
  .use( require( './middleware/redirect' ) )
  .use( require( './middleware/parse-body' ) )
  .use( require( './middleware/parse-cookie' ) )
  .use( require( './middleware/create-session' ) )
  .use( require( './routes/message2' ) )
  .use( require( './routes/message' ) )
  .use( require( './routes/signup' ) )
  .use( require( './routes/logout' ) )
  .use( require( './routes/index' ) )
  .use( require( './routes/wrong' ) )
  .use( require( './routes/login' ) )
  .use( require( './routes/user' ) );

router.use( function E404 ( request, response ) {
  response.redirect( '/wrong/?status=404&message=not found' );
} );

module.exports = router;
