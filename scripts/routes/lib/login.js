'use strict';

const { query } = require( '../../database' );
const { bytes, matches } = require( '../../hash2' );

module.exports = ( username, password, response ) => {
  let user;

  return query( 'SELECT id, password, secret, salt, alias FROM users WHERE username = $1;', [ username ] )
    .then( ( data ) => {
      if ( ! ( user = data.rows[ 0 ] ) ) {
        throw `Не могу найти "${username}" пользователя`;
      }

      return matches( password, user );
    } )
    .then( ( matches ) => {
      if ( ! matches ) {
        throw `Пароль не правильный (может быть раскладка?)`;
      }

      return bytes( 64 );
    } )
    .then( ( session ) => {
      const Expires = new Date( Date.now() + 1000 * 60 * 60 * 24 * 365 );

      return query( 'INSERT INTO "user-sessions" ( id, session, expires ) VALUES ( $1, $2, $3 )', [
        user.id, session, Expires.toUTCString()
      ] ).then( () => {
        response.cookie( 'user-session', session, { Expires } );

        return {
          alias: user.alias,
          id:    user.id
        };
      } );
    } )
    .catch( ( message ) => {
      if ( typeof message === 'string' ) {
        return message;
      }

      throw message;
    } );
};
