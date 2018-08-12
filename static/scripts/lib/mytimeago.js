'use strict';

var ARRAY = [ 60, 60, 24, 7, 365 / 12 / 7, 12 ];

module.exports = function format ( date, locale ) {
  var diff = ( date - new Date().getTime() ) / 1000;
  var i, j;

  if ( diff <= 0 ) {
    diff = - diff;
    j = 0;
  } else {
    j = 1;
  }

  for ( i = 0; i < ARRAY.length && diff >= ARRAY[ i ]; ++i ) {
    diff /= ARRAY[ i ];
  }

  diff = Math.floor( diff );

  i *= 2;

  if ( diff > 1 ) {
    ++i;
  }

  return locale( diff, i )[ j ].replace( '%s', diff );
};
