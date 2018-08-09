'use strict';

const Router = require( './lib/Router' );

const router = new Router()
  .set( 'view-engine', require( './engine' ) )
  .use( require( './middleware/parse-query' ) )
  // .use( require( './middleware/security' ) )
  .use( require( 'helmet' )( {
    frameguard: {
      action: 'deny'
    },

    contentSecurityPolicy: {
      directives: {
        'default-src': [ "'self'" ]
      }
    }
  } ) )
  .use( require( './lib/static' )( 'static' ) )
  .use( require( './middleware/redirect' ) )
  .use( require( './middleware/parse-body' ) )
  .use( require( './middleware/parse-cookie' ) )
  .use( require( './middleware/create-session' ) )
  .use( require( './routes/signup' ) )
  .use( require( './routes/logout' ) )
  .use( require( './routes/index' ) )
  .use( require( './routes/wrong' ) )
  .use( require( './routes/login' ) )
  .use( require( './routes/user' ) );

router.all( '*', ( request, response ) => {
  response.redirect( '/wrong?status=404&message=not found' );
} );

module.exports = router;
