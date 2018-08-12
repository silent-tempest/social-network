'use strict';

var Route = require( '../lib/Route' );

module.exports = new Route( '/message2/:id' ).get( function message2 () {
  arguments[ 1 ].html( '<h1>Message 2</h1>' );
} );
