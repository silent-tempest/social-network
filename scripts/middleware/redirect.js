'use strict';

var Route = require( '../lib/Route' );

module.exports = new Route( /[^\/]$/ ).get( function ( request, response ) {
  if ( request.rawQuery ) {
    response.redirect( request.url + '/?' + request.rawQuery, 301 );
  } else {
    response.redirect( request.url + '/', 301 );
  }
} );
