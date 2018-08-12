'use strict';

const Route       = require( '../lib/Route' );
const read        = require( '../read' );
const mime        = require( 'mime' );
const { join }    = require( 'path' );

module.exports = ( folder, options ) => {
  const path = options && options.all
    ? '*'
    : /\.[a-z]+$/i;

  return new Route( path ).all( ( request, response, next ) => {
    if ( request.method !== 'GET' && request.method !== 'HEAD' ) {
      return next();
    }

    read( join( folder, request.url ) )
      .then( ( data ) => {
        const type = mime.getType( request.url );

        if ( type ) {
          response.setHeader( 'Content-Type', type );
        }

        response.statusCode = 200;
        response.end( data );
      } )
      .catch( ( error ) => {
        if ( error.code !== 'EISDIR' && error.code !== 'ENOENT' ) {
          throw error;
        }

        next();
      } );
  } );
};
