'use strict';

var https  = require( 'https' );
var router = require( './scripts/router' );
var write  = require( './scripts/write' );
var read   = require( './scripts/read' );

var _options;

Promise.all( [
  read( './server-certificate.crt' ),
  read( './server-key.key' ),
  read( './data/users.json' )
] )
  .then( function ( data ) {
    _options = {
      cert: data[ 0 ].toString( 'utf8' ),
      key:  data[ 1 ].toString( 'utf8' )
    };

    if ( ! data[ 2 ].length ) {
      return write( './data/users.json', '[]' );
    }
  } )
  .then( function () {
    https.createServer( _options, router.handle.bind( router ) ).listen( 9000, function () {
      console.log( 'listening on "https://localhost:9000/"...' );
    } );
  } );
