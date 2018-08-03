'use strict';

var parseQS = require( 'qs/lib/parse' );
var Route   = require( '../lib/Route' );

module.exports = new Route( '*' ).post( function ( request, response, next ) {
  request.rawBody = '';
  request.body    = '';

  request.on( 'end', function onrequestend () {
    var type = request.headers[ 'content-type' ];

    try {
      if ( type === 'application/json' ) {
        request.body = JSON.parse( request.rawBody );
      } else if ( type === 'application/x-www-form-urlencoded' ) {
        request.body = parseQS( request.rawBody );
      }

      next();
    } catch ( error ) {
      throw 400;
    }
  } );

  request.on( 'data', function onrequestdata ( chunk ) {
    if ( ( request.rawBody += chunk ).length >= 1e6 ) {
      throw 413;
    }
  } );
} );
