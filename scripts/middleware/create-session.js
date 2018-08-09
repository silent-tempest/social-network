'use strict';

const { query, user } = require( '../database' );

const tryUserSession = ( request ) => {
  if ( ! request.cookie[ 'user-session' ] ) {
    return Promise.resolve( true );
  }

  return query( 'SELECT id, expires FROM "user-sessions" WHERE session = $1;', [ request.cookie[ 'user-session' ] ] )
    .then( ( data ) => {
      const session = data.rows[ 0 ];

      if ( session && Date.now() < session.expires ) {
        return user( session.id );
      }
    } )
    .then( ( data ) => {
      if ( data && data.rows[ 0 ] ) {
        request.session.user = data.rows[ 0 ];
      } else {
        return true;
      }
    } );
};

const trySignupSession = ( request ) => {
  if ( ! request.cookie[ 'signup-session' ] ) {
    return;
  }

  return query( 'SELECT username, sex, expires FROM "signup-sessions" WHERE session = $1;', [
    request.cookie[ 'signup-session' ]
  ] ).then( ( data ) => {
    const session = data.rows[ 0 ];

    if ( session && Date.now() < session.expires ) {
      request.session.username = session.username;
      request.session.sex = session.sex;
    }
  } );
};

module.exports = ( request, response, next ) => {
  request.session = {};

  if ( ! request.cookie[ 'user-session' ] && ! request.cookie[ 'signup-session' ] ) {
    return next();
  }

  tryUserSession( request )
    .then( ( fail ) => {
      if ( fail ) {
        return trySignupSession( request );
      }
    } )
    .then( () => {
      next();
    } );
};
