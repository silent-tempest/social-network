'use strict';

const Route = require( '../lib/Route' );
const read  = require( '../read' );
const mime  = require( 'mime' );
const path  = require( 'path' );

module.exports = ( folder ) => {

  // listen only paths with extensions

  return new Route( /\.[a-z]+$/i ).all( ( request, response, next ) => {
    if ( request.method !== 'GET' && request.method !== 'HEAD' ) {
      return next();
    }

    return read( path.join( folder, request.url ) )
      .then( function ( data ) {
        const type = mime.getType( request.url );

        if ( type ) {
          response.setHeader( 'Content-Type', type );
        }

        response.statusCode = 200;
        response.end( data );
      } )
      .catch( function ( error ) {
        if ( error.code !== 'EISDIR' && error.code !== 'ENOENT' ) {
          throw error;
        }

        next();
      } );
  } );
};
