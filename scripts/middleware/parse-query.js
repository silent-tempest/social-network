'use strict';

var parseQS = require( 'qs/lib/parse' );

module.exports = function parseQuery ( request, response, next ) {
  var match = /\?(.*)$/.exec( request.url );

  if ( match ) {
    request.query = parseQS( request.rawQuery = match[ 1 ] );
    request.url   = request.url.slice( 0, match.index );
  } else {
    request.rawQuery = '';
    request.query    = '';
  }

  next();
};
