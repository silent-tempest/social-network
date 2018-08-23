'use strict';

let parse = require( 'super-cookie/lib/parse' );

function parseCookie ( request, response, next ) {
  if ( ! request.cookie ) {
    if ( request.headers.cookie ) {
      request.cookie = parse( request.headers.cookie );
    } else {
      request.cookie = {};
    }
  }

  next();
}

module.exports = parseCookie;
