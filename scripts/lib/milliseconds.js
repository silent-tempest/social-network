'use strict';

const toString = Object.prototype.toString;

/**
 * @param {number|string} value
 * @returns {number}
 * @example
 * milliseconds( 'millisecond' );      // -> 1
 * milliseconds( '500 milliseconds' ); // -> 500
 * milliseconds( '10s' );              // -> 10000
 * milliseconds( 10 );                 // -> 10000
 * milliseconds( '-1 day' );           // -> -86400000
 * milliseconds( '2 years' );          // -> 63072000000
 * milliseconds( 'abc' );
 * // TypeError: cannot convert abc ([object String]) into milliseconds
 */
module.exports = ( value ) => {
  let milliseconds;

  if ( typeof value === 'number' ) {
    milliseconds = value * 1000;
  } else if ( typeof value === 'string' && /^\s*([+-]?(?:\d+|\d*\.\d+))?\s*(ms|s|m|h|d|y|milliseconds?|seconds?|minutes?|hours?|days?|years?)\s*$/.test( value ) ) {
    milliseconds = RegExp.$1 ? + RegExp.$1 : 1;

    switch ( RegExp.$2 ) {
      case 'years':
      case 'year':
      case 'y':
        milliseconds *= 365;
        /* falls through */
      case 'days':
      case 'day':
      case 'd':
        milliseconds *= 24;
        /* falls through */
      case 'hours':
      case 'hour':
      case 'h':
        milliseconds *= 60;
        /* falls through */
      case 'minutes':
      case 'minute':
      case 'm':
        milliseconds *= 60;
        /* falls through */
      case 'seconds':
      case 'second':
      case 's':
        milliseconds *= 1000;
    }
  } else {
    throw TypeError( `cannot convert ${value} (${toString.call( value )}) into milliseconds` );
  }

  return milliseconds || 0;
};
