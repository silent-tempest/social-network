'use strict';

var parseQS = require( 'qs/lib/parse' );

module.exports = function parseQuery ( req ) {
  var match = /\?(.*)$/.exec( req.url );

  req.rawQuery = '';
  req.query    = '';

  if ( match ) {
    req.query = parseQS( req.rawQuery = RegExp.$1 );
    req.url   = req.url.slice( 0, match.index );
  }
};
