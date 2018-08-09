'use strict';

const Route  = require( '../lib/Route');
const engine = require( '../engine' );

module.exports = new Route( '/' ).get( ( request, response ) => {
  if ( request.session.user ) {
    return response.redirect( `/user/${request.session.user.id}/` );
  }

  if ( request.session.username ) {
    return response.redirect( '/signup/' );
  }

  response.statusCode = 200;

  response.render( 'index2', {
    page: 'index',
    head: [ engine.link( './dist/styles/index2.bundle.min.css' ) ],
    body: [ engine.script( './dist/scripts/index2.bundle.min.js' ) ]
  } );
} );
