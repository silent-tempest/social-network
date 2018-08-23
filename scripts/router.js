'use strict';

let NetworkError = require( 'network-error' );
let Router       = require( './lib/Router' );

let router = new Router()
  .set( 'view engine', require( './engine' ) )
  .use( require( './middleware/parse-query' ) )
  .use( require( './middleware/skip-upgrade' ) )
  .use( require( './middleware/helmet' ) )
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
  .use( require( './routes/user' ) )
  .use( require( './routes/message' ) );

router.use( function E404 ( request, response ) {
  response.redirect( '/wrong/?s=404&m=not found' );
} );

router.use( function E500 ( error, request, response, next ) { // jshint ignore: line
  if ( error instanceof NetworkError === false ) {
    error = NetworkError.from( error );
  }

  console.log( error );
  response.redirect( `/wrong/?s=${error.status}&m=${error.message}` );
} );

module.exports = router;
