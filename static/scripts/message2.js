'use strict';

var socket = require( 'socket.io-client' )( 'https://localhost' );

if ( top !== self ) {
  top.location = self.location;
}

socket.on( 'connect', function onconnect ( event ) {
  console.log( 'connected', event );
} );
