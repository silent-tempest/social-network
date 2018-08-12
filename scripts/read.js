'use strict';

const fs = require( 'fs' );

/**
 * Promisified fs.readFile.
 * @param {string} path
 * @param {string?} [encoding=null]
 * @returns {Promise<Buffer>}
 */
const read = ( path, encoding = null ) => {
  return new Promise( ( resolve, reject ) => {
    fs.readFile( path, encoding, ( error, data ) => {
      if ( error ) {
        reject( error );
      } else {
        resolve( data );
      }
    } );
  } );
};

module.exports = read;
