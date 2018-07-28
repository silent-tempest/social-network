'use strict';

var ajax = require( 'peako/ajax' ),
    _    = require( 'peako/_' );

_( '#signup' ).submit( function ( event ) {
  var data = {
    confirmedPassword: _( '#confirmed-password' ).value(),
    password:          _( '#password' ).value(),
    username:          _( '#username' ).value(),
    gender:            _( '#gender' ).value()
  };

  var headers = {
    'Content-Type': 'application/json'
  };

  // jshint validthis: true

  function success ( d ) {
    _( '#message' ).html( '<a href="' + d.url + '">' + d.username + '</a> account created!' );
  }

  function error ( d ) {
    if ( d.selector ) {
      _( d.selector ).css( 'color', 'red' );
    }

    _( '#message' ).html( d.message || 'Error ' + this.status + ': "' + this.statusText + '"' );
  }

  // jshint validthis: false

  ajax( '/signup', {
    headers: headers,
    success: success,
    error:   error,
    data:    data
  } );

  event.preventDefault();
} );
