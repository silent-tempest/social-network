'use strict';

const { resolve, sep } = require( 'path' );

/**
 * Safe resolves path with folder scope.
 * @param {string} folder
 * @param {string} path
 * @returns {string?} Returns null when path is out of scope.
 * @example
 * resolve( 'static', '../server.js' );       // -> null
 * resolve( 'static', './scripts/index.js' ); // -> '/path/to/static/scripts/index.js'
 * resolve( 'static', './scripts/../index.js' ); // -> '/path/to/static/index.js'
 */
const resolve = ( folder, path ) => {
  const elements = path.split( sep );
  const result   = [];

  for ( let element of elements ) {
    if ( element === '..' ) {
      if ( ! result.length ) {
        return null;
      }

      result.pop();
    } else if ( element !== '.' && element !== '' ) {
      result.push( element );
    }
  }

  return resolve( folder, result.join( sep ) );
};

module.exports = resolve;
