'use strict';

var ajax = require( 'peako/ajax' ),
    _    = require( 'peako/_' );

login.onsubmit = function onsubmit ( event ) {

  var data = {
    username: username.value,
    password: password.value
  };

  var headers = {
    'Content-Type': 'application/json'
  };

  function success ( d ) {
    message.innerHTML = 'success';
  }

  function error ( data ) {
    if ( data.selector ) {
      _( data.selector ).css( 'color', 'red' );
    }

    message.innerHTML = data.message || 'Error ' + this.status + ': "' + this.statusText + '"';
  }

  ajax( '/login', {
    headers: headers,
    success: success,
    error: error,
    data: data
  } );

  event.preventDefault();

};
