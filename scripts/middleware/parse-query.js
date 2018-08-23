'use strict';

let parse = require( 'qs/lib/parse' );

function parseQuery ( request, response, next ) {
  if ( ! request.query ) {
    let match = /\?(.*)$/.exec( request.rawUrl = request.url );

    if ( match ) {
      request.query = parse( request.rawQuery = match[ 1 ] );
      request.url   = request.url.slice( 0, match.index );
    } else {
      request.rawQuery = '';
      request.query    = {};
    }
  }

  next();
}

module.exports = parseQuery;
