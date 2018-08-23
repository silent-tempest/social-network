'use strict';

let Route   = require( '../lib/Route' );
let resolve = require( 'safe-resolve-path' );
let { lstat, access, createReadStream, F_OK } = require( 'fs' );

function handleError ( error, response ) {
  if ( error ) {
    if ( error.code === 'ENOENT' ) {
      response.status( 404 ).end();
    } else {
      response.status( 500 ).end();
    }

    return true;
  }
}

module.exports = ( folder, options = {} ) => {
  return new Route( options.pattern || /\.[a-z]+$/i ).all( ( request, response, next ) => {
    if ( request.method !== 'GET' && request.method !== 'HEAD' ) {
      return next();
    }

    let path = resolve( folder, request.url );

    if ( request.method === 'HEAD' ) {
      lstat( path, ( error, stats ) => {
        if ( ! handleError( error, response ) ) {
          response.status( 200 ).type( path ).header( 'Content-Length', stats.size ).end();
        }
      } );

      return;
    }

    access( path, F_OK, ( error ) => {
      if ( ! handleError( error, response ) ) {
        createReadStream( path ).pipe( response.status( 200 ).type( path ) );
      }
    } );
  } );
};
