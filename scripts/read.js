'use strict';

var fs = require( 'fs' );

// read( './data/users.json' )
//   .then( ( users ) => JSON.parse( users ) );

module.exports = function read ( url ) {
  return new Promise( function ( rs, rj ) {
    fs.readFile( url, function ( e, d ) {
      if ( e ) {
        rj( e );
      } else {
        rs( d );
      }
    } );
  } );
};
