'use strict';

let router = require( './scripts/router' );
let server = require( './scripts/server' );

server.on( 'request', router.handle.bind( router ) ).listen( 3000, () => {
  console.log( 'listening on "https://localhost:3000/"...' );
} );
