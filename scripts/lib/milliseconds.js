'use strict';

const toString = Object.prototype.toString;

module.exports = ( value ) => {
  let milliseconds;

  if ( typeof value === 'number' ) {
    milliseconds = value * 1000;
  } else if ( typeof value === 'string' && /^\s*(\d+|\d*\.\d+)\s*(milliseconds?|seconds?|minutes?|hours?|days?)\s*$/.test( value ) ) {
    milliseconds = + RegExp.$1;

    switch ( RegExp.$2 ) {
      case 'days':
      case 'day':
        milliseconds *= 24;
        /* falls through */
      case 'hours':
      case 'hour':
        milliseconds *= 60;
        /* falls through */
      case 'minutes':
      case 'minute':
        milliseconds *= 60;
        /* falls through */
      case 'seconds':
      case 'second':
        milliseconds *= 1000; // fall-through
    }
  } else {
    throw TypeError( `cannot convert ${value} (${toString.call( value )}) into milliseconds` );
  }

  return milliseconds || 0;
};
