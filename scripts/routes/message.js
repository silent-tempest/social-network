'use strict';

const { query, user } = require( '../database' );
const engine = require( '../engine' );
const Route = require( '../lib/Route' );

exports = module.exports = new Route( '/message/:id' );

exports.get( function message ( request, response ) {
  if ( ! request.session.user ) {
    return response.redirect( `/` );
  }

  Promise.all( [
    query( 'SELECT * FROM messages WHERE "author-id" = $1 AND "addressee-id" = $2 OR "author-id" = $2 AND "addressee-id" = $1;', [
      request.session.user.id,
      request.params.id
    ] ),

    user( request.params.id, request.session.user )
  ] ).then( ( promises ) => {
    response.render( 'message', {
      messages: promises[ 0 ].rows,
      body: [ engine.script( '../../dist/scripts/message.bundle.min.js' ) ],
      loggedAs: request.session.user,
      users: {
        [ request.session.user.id ]: request.session.user,
        [ promises[ 1 ].rows[ 0 ].id ]: promises[ 1 ].rows[ 0 ]
      }
    } );
  } );
} );

exports.post( function message ( request, response ) {
  if ( ! request.session.user || ! request.body.message ) {
    response.statusCode = request.session.user
      ? 400
      : 401;
    response.end();
    return;
  }

  user( request.params.id, request.session.user )
    .then( ( userData ) => {
      if ( ! userData.rows.length ) {
        response.statusCode = 404;
        response.end();
        throw null;
      }

      return query( 'INSERT INTO messages ( "author-id", "addressee-id", contents, date ) VALUES ( $1, $2, $3, NOW() ) RETURNING *;', [
        request.session.user.id,
        request.params.id,
        request.body.message
      ] ).then( ( data ) => {
        response.statusCode = 201;
        response.html( engine.include( 'partials/message', {
          message: data.rows[ 0 ],
          data: {
            loggedAs: request.session.user,
            users: {
              [ request.session.user.id ]: request.session.user,
              [ userData.rows[ 0 ].id ]: userData.rows[ 0 ]
            }
          }
        } ) );
      } );
    } )
    .catch( ( error ) => {
      if ( error !== null ) {
        console.log( error );
      }
    } );
} );
