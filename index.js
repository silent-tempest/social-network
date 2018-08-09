'use strict';

const https  = require( 'https' );
const router = require( './scripts/router' );
const read   = require( './scripts/read' );

Promise.all( [
  read( './server-certificate.crt' ),
  read( './server-key.key' )
] ).then( ( data ) => {
  const options = require( './config' ).ssl = {
    cert: data[ 0 ].toString( 'utf8' ),
    key:  data[ 1 ].toString( 'utf8' )
  };

  https.createServer( options, router.handle.bind( router ) ).listen( 3000, () => {
    console.log( 'listening on "https://localhost:3000/"...' );
  } );
} );
