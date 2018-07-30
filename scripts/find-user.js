'use strict';

var find = require( 'peako/find' );

var constants = require( './constants' ),
    read      = require( './read' );

module.exports = function user ( cookie, _users ) {
  return new Promise( function ( resolve, reject ) {
    if ( cookie.login && cookie.id ) {
      resolve( _users || read( './data/users.json' ) );
    } else {
      reject( constants.NO_USER );
    }
  } )
    .then( function ( users ) {
      return _users || JSON.parse( users );
    } )
    .then( function ( users ) {
      var user;

      if ( ( user = find( users, [ 'id', cookie.id ] ) ) || ~ ( user.logins.indexOf( cookie.login ) ) ) {
        return user;
      }

      throw constants.NO_USER;
    } );
};
