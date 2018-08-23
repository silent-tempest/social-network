'use strict';

const Route = require( '../lib/Route' );
const login = require( './lib/login' );

module.exports = new Route( '/login' ).post( ( request, response ) => {
  if ( request.session.user ) {
    return response.redirect( `/user/${request.session.user.alias || request.session.user.id}/` );
  }

  return login( request.body.username, request.body.password, response ).then( ( user ) => {
    if ( typeof user === 'string' ) {
      response.status( 400 ).type( 'text' ).end( user );
    } else {
      response.redirect( `/user/${user.alias || user.id}/` );
    }
  } );
} );
