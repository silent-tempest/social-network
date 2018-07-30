'use strict';

var find = require( 'peako/find' );

var constants = require( './constants' ),
    read      = require( './read' );

module.exports = function user ( cookie, _users, _cookie ) {
  if ( typeof _users === 'boolean' ) {
    _cookie = _users;
    _users = null;
  }

  return new Promise( function ( resolve, reject ) {
    if ( cookie.userid && ( ! _cookie || cookie.sessionid ) ) {
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

      if ( ( user = find( users, [ 'id', cookie.userid ] ) ) && ( ! _cookie || ~ user.sessions.indexOf( cookie.sessionid ) ) )  {
        return user;
      }

      throw constants.NO_USER;
    } );
};
