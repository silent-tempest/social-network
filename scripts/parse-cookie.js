'use strict';

var fromPairs = require( 'peako/from-pairs' );

function split ( pair ) {
  return pair.split( '=' );
}

module.exports = function parseCookie ( req ) {
  if ( req.headers.cookie ) {
    req.cookie = fromPairs( req.headers.cookie.split( '; ' ).map( split ) );
  } else {
    req.cookie = {};
  }
};
