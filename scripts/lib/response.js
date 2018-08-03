'use strict';

var response = Object.create( require( 'http' ).ServerResponse.prototype );

response.redirect = function redirect ( url, status ) {
  this.statusCode = status || 302;
  this.setHeader( 'Location', url );
  this.end();
};

module.exports = response;
