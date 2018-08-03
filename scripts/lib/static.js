'use strict';

var Route = require( '../lib/Route' );
var read  = require( '../read' );
var mime  = require( 'mime' );
var path  = require( 'path' );

module.exports = function ( folder ) {
  return new Route( /[^\/]$/ ).all( function ( request, response, next ) {
    if ( request.method !== 'GET' && request.method !== 'HEAD' ) {
      return next();
    }

    return read( path.join( folder, request.url ) )
      .then( function ( data ) {
        var type = mime.getType( request.url );

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

        return next();
      } );
  } );
};
