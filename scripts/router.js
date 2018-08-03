'use strict';

var Router  = require( './lib/Router' );

var router = new Router()
  .use( require( './middleware/initialize' ) )
  .use( require( './middleware/parse-query' ) )
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

module.exports = router;
