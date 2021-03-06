'use strict';

var Route = require( '../lib/Route' );

module.exports = new Route( /[^\/]$/ ).get( function redirect ( request, response ) {
  if ( request.rawQuery ) {
    response.redirect( request.url + '/?' + request.rawQuery );
  } else {
    response.redirect( request.url + '/' );
  }
} );
