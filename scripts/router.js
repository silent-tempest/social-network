'use strict';

var Router = require( './Router' );

var router = new Router()
  .static( 'static' )
  .handle( require( './routes/signup' ) )
  .handle( require( './routes/logout' ) )
  .handle( require( './routes/index' ) )
  .handle( require( './routes/wrong' ) )
  .handle( require( './routes/login' ) )
  .handle( require( './routes/user' ) );

module.exports = router;
