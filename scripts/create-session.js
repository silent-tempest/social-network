'use strict';

var taffy = require( 'taffy' );
var read  = require( './read' );

module.exports = function createSession ( request ) {
  request.session = {};

  return new Promise( ( resolve, reject ) => {
    if ( request.cookie.sessionid && request.cookie.userid ) {
      resolve( read( './data/users.json' ) );
    } else {
      reject( 1 );
    }
  } )
    .then( ( users ) => {
      users = taffy( JSON.parse( users ) );

      const user = users( {
        sessions: {
          has: request.cookie.sessionid
        },

        id: request.cookie.userid,
      } ).first();

      if ( user ) {
        request.session.user = user;
      }
    } )
    .catch( ( error ) => {
      if ( error !== 1 ) {
        throw error;
      }
    } );
};
