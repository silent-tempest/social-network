'use strict';

module.exports = function ( request, response, next ) {
  response.setHeader( 'X-Frame-Options', 'DENY' );
  next();
};
