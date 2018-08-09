'use strict';

const parse = require( 'qs/lib/parse' );

module.exports = ( request, response, next ) => {
  const match = /\?(.*)$/.exec( request.url );

  if ( match ) {
    request.query = parse( request.rawQuery = match[ 1 ] );
    request.url   = request.url.slice( 0, match.index );
  } else {
    request.rawQuery = '';
    request.query    = {};
  }

  next();
};
