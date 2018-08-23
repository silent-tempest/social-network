'use strict';

const Route = require( '../lib/Route' );
const { query } = require( '../database' );
const engine = require( '../engine' );
const verifyUsername = require( './lib/verify-username' );
const verifyPassword = require( './lib/verify-password' );
const hash2 = require( '../hash2' );
const login = require( './lib/login' );

module.exports = new Route( '/signup' );

const step0 = ( request ) => {
  const message = verifyUsername( request.body.username );

  if ( message ) {
    return Promise.resolve( { status: 400, message } );
  }

  return query( 'SELECT FROM users WHERE username = $1;', [ request.body.username.trim() ] ).then( ( data ) => {
    if ( data.rows.length ) {
      return { status: 409, message: 'Это имя уже занято' };
    } else {
      return { status: 200 };
    }
  } );
};

module.exports.post( ( request, response, next ) => {
  if ( request.query.step === '0' ) {
    step0( request ).then( ( data ) => {
      response.status( data.status ).type( 'text' );

      if ( data.status !== 200 ) {
        response.end( data.message );
      } else {
        response.end();
      }
    } );
  } else if ( request.query.step === '1' ) {
    step0( request )
      .then( ( data ) => {
        if ( data.status === 200 ) {
          return hash2.bytes( 64 );
        }

        response.status( data.status ).type( 'text' ).end( data.message );
      } )
      .then( ( session ) => {
        if ( ! session ) {
          return;
        }

        if ( request.body.sex !== 'F' && request.body.sex !== 'M' ) {
          request.body.sex = null;
        }

        // Expires in one hour
        const Expires = new Date( Date.now() + 1000 * 60 * 60 );

        query( 'INSERT INTO signup_sessions ( username, sex, session, expires ) VALUES ( $1, $2, $3, $4 );', [
          request.body.username.trim(), request.body.sex, session, Expires.toISOString()
        ] ).then( () => {
          response.cookie( 's_id', session, { Path: '/', Expires } );
          response.redirect( '/signup/' );
        } );
      } );
  } else if ( request.query.step === '2' && request.session.username ) {
    const message = verifyPassword( request.body.password, request.body.confirmedPassword ) ||
      request.body.password !== request.body.confirmedPassword && 'Пароли не совпадают';

    if ( message ) {
      return response.status( 400 ).type( 'text' ).end( message );
    }

    query( 'DELETE FROM signup_sessions WHERE session = $1;', [ request.cookie.s_id ] )
      .then( () => {
        response.cookie( 's_id', '', { Path: '/', MaxAge: 0 } );
        return hash2.create( request.body.password );
      } )
      .then( ( data ) => {
        return query( 'INSERT INTO users ( username, password, secret, salt, sex ) VALUES ( $1, $2, $3, $4, $5 );', [
          request.session.username,
          data.password,
          data.secret,
          data.salt,
          request.session.sex
        ] );
      } )
      .then( () => {
        return login( request.session.username, request.body.password, response );
      } )
      .then( ( user ) => {
        response.redirect( `/user/${user.id}/` );
      } );
  } else {
    next();
  }
} );

module.exports.get( ( request, response ) => {
  if ( request.session.username ) {
    response.status( 200 ).render( 'signup2', {
      username: request.session.username,
      title: 'finishing',
      head: [ engine.link( '../dist/styles/signup2.bundle.min.css' ) ],
      body: [ engine.script( '../dist/scripts/signup2.bundle.min.js' ) ]
    } );
  } else {
    response.redirect( '/' );
  }
} );
