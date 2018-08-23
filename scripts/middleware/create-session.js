// todo refactor

'use strict';

const { query, user } = require( '../database' );

const tryUserSession = ( request ) => {
  if ( ! request.cookie.u_id ) {
    return Promise.resolve( true );
  }

  return query( 'SELECT id, expires FROM user_sessions WHERE session = $1;', [ request.cookie.u_id ] )
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
  if ( ! request.cookie.s_id ) {
    return;
  }

  return query( 'SELECT username, sex, expires FROM signup_sessions WHERE session = $1;', [
    request.cookie.s_id
  ] ).then( ( data ) => {
    const session = data.rows[ 0 ];

    if ( session && Date.now() < session.expires ) {
      request.session.username = session.username;
      request.session.sex = session.sex;
    }
  } );
};

const createSession = ( request, response, next ) => {
  if ( request.session ) {
    return next();
  }

  request.session = {};

  if ( ! request.cookie.u_id && ! request.cookie.s_id ) {
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

module.exports = createSession;
