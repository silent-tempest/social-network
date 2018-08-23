'use strict';

var socket = require( 'socket.io-client' )( 'https://localhost:3000', {
  query: 'socket=1',
  path: '/message_socket'
} );

socket.on( 'connect', function () {
  console.log( 'connected to the server' );
} );
