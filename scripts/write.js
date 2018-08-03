'use strict';

var fs = require( 'fs' );

// write( './data/users.json', users )
//   .then( () => res.end() );

module.exports = function write ( url, d ) {
  return new Promise( function ( rs, rj ) {
    fs.writeFile( url, d, function ( e ) {
      if ( e ) {
        rj( e );
      } else {
        rs( d );
      }
    } );
  } );
};
