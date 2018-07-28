'use strict';

var fs = require( 'fs' );

// write( './data/users.json', users )
//   .then( () => res.end() );

module.exports = function write ( url, d ) {
  return new Promise( function ( res, rej ) {
    fs.writeFile( url, d, function ( e ) {
      if ( e ) {
        rej( e );
      } else {
        res( d );
      }
    } );
  } );
};
