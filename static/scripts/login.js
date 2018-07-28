'use strict';

var ajax = require( 'peako/ajax' ),
    _    = require( 'peako/_' );

_( '#login' ).submit( function ( event ) {
  var data = {
    password: _( '#password' ).value(),
    username: _( '#username' ).value()
  };

  var headers = {
    'Content-Type': 'application/json'
  };

  // jshint validthis: true

  function success () {
    _( '#message' ).html( 'success' );
  }

  function error ( d ) {
    if ( d.selector ) {
      _( d.selector ).css( 'color', 'red' );
    }

    _( '#message' ).html( d.message || 'Error ' + this.status + ': "' + this.statusText + '"' );
  }

  // jshint validthis: false

  ajax( '/login', {
    headers: headers,
    success: success,
    error:   error,
    data:    data
  } );

  event.preventDefault();
} );
