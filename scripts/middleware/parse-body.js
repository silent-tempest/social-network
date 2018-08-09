'use strict';

const parse = require( 'qs/lib/parse' );
const Route = require( '../lib/Route' );

module.exports = new Route( '*' ).post( ( request, response, next ) => {
  request.rawBody = Buffer( 0 );
  request.body    = '';

  const length = request.headers[ 'content-length' ];

  if ( typeof length === 'undefined' || + length > 1e6 ) {
    if ( length ) {
      response.statusCode = 413; // Payload Too Large
    } else {
      response.statusCode = 411; // Length Required
    }

    response.end();
    return;
  }

  const chunks = [];
  let bodyLength = 0;

  request.on( 'end', ( error ) => {
    if ( error ) {
      return next( error );
    }

    if ( bodyLength !== + length ) {
      response.statusCode = 400;
      response.end();
      return;
    }

    request.rawBody = Buffer.concat( chunks );

    try {
      const type = request.headers[ 'content-type' ];

      if ( type === 'application/json' ) {
        request.body = JSON.parse( request.rawBody );
      } else if ( type === 'application/x-www-form-urlencoded' ) {
        request.body = parse( '' + request.rawBody );
      }

      next();
    } catch ( error ) {
      next( error );
    }
  } );

  request.on( 'data', ( chunk ) => {
    if ( ( bodyLength += chunk.length ) > + length ) {
      response.statusCode = 413; // Payload Too Large
      response.end();
    } else {
      chunks.push( chunk );
    }
  } );
} );
