'use strict';

var Route = require( '../lib/Route' );

module.exports = new Route( '/wrong' ).get( ( request, response ) => {
  response.statusCode = 400; // bad request
  response.render( 'wrong', request.query );
} );
