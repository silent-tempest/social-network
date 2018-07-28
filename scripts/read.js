'use strict';

var fs = require( 'fs' );

// read( './data/users.json' )
//   .then( ( users ) => JSON.parse( users ) );

module.exports = function read ( url ) {
  return new Promise( function ( res, rej ) {
    fs.readFile( url, 'utf8', function ( e, d ) {
      if ( e ) {
        rej( e );
      } else {
        res( d );
      }
    } );
  } );
};
