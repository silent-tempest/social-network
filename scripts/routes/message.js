'use strict';

let Route = require( '../lib/Route' );
let server = require( '../server' );
let { script } = require( '../engine' );
let socket = require( 'socket.io' )( server, { path: '/message_socket' } );

socket.on( 'connection', () => {
  console.log( 'client connected' );
} );

module.exports = new Route( '/message' ).get( ( request, response ) => {
  if ( request.session.user ) {
    response.type( 'html' ).status( 200 ).end( 'messages here' + script( '../dist/scripts/message.bundle.min.js' ) );
  } else {
    response.redirect( '/' );
  }
} );
