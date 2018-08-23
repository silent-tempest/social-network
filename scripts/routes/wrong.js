'use strict';

var Route = require( '../lib/Route' );

module.exports = new Route( '/wrong' ).get( ( request, response ) => {
  response.status( 400 ).render( 'wrong', request.query );
} );
