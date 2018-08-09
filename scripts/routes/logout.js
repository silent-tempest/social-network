'use strict';

const { query } = require( '../database' );
const Route = require( '../lib/Route' );

module.exports = new Route( '/logout' ).get( ( request, response ) => {
  if ( request.session.user ) {
    query( 'DELETE FROM "user-sessions" WHERE id = $1 AND session = $2;', [
      request.session.user.id, request.cookie[ 'user-session' ]
    ] ).then( () => {
      response.cookie( 'user-session', '', { MaxAge: 0 } );
      response.redirect( '/' );
    } );
  } else if ( request.session.username ) {
    query( 'DELETE FROM "signup-sessions" WHERE session = $1;', [
      request.cookie[ 'signup-session' ]
    ] ).then( () => {
      response.cookie( 'signup-session', '', { MaxAge: 0 } );
      response.redirect( '/' );
    } );
  } else {
    response.redirect( '/' );
  }
} );
