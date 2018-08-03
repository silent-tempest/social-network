'use strict';

var fromPairs = require( 'peako/from-pairs' );

function split ( pair ) {
  return pair.split( '=' );
}

module.exports = function parseCookie ( request, response, next ) {
  if ( request.headers.cookie ) {
    request.cookie = fromPairs( request.headers.cookie.split( '; ' ).map( split ) );
  } else {
    request.cookie = {};
  }

  next();
};
