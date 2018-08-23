'use strict';

const { query } = require( '../database' );
const Route = require( '../lib/Route' );

module.exports = new Route( '/logout' ).get( ( request, response ) => {
  if ( request.session.user ) {
    query( 'DELETE FROM user_sessions WHERE id = $1 AND session = $2;', [
      request.session.user.id, request.cookie.u_id
    ] ).then( () => {
      response.cookie( 'u_id', '', { Path: '/', MaxAge: 0 } );
      response.redirect( '/' );
    } );
  } else if ( request.session.username ) {
    query( 'DELETE FROM signup_sessions WHERE session = $1;', [
      request.cookie.s_id
    ] ).then( () => {
      response.cookie( 's_id', '', { Path: '/', MaxAge: 0 } );
      response.redirect( '/' );
    } );
  } else {
    response.redirect( '/' );
  }
} );
