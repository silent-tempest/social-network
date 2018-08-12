'use strict';

const milliseconds = require( './milliseconds' );

// serializeCookie( 'signup-session', session, { MaxAge: '1 hour' } );
// serializeCookie( 'user-session', session, { MaxAge: 365 * 24 * 60 * 60 } );

module.exports = ( key, value, options ) => {
  let result = key + '=' + value;

  if ( typeof options.MaxAge !== 'undefined' || typeof options.Expires !== 'undefined' ) {
    let MaxAge, Expires;

    if ( typeof options.MaxAge !== 'undefined' ) {
      MaxAge  = milliseconds( options.MaxAge );
      Expires = new Date( Date.now() + MaxAge );
    } else {
      MaxAge  = options.Expires - Date.now();
      Expires = options.Expires;
    }

    result += '; Expires=' + Expires.toGMTString() + '; Max-Age=' + MaxAge * 0.001;
  }

  if ( typeof options.HttpOnly === 'undefined' || options.HttpOnly ) {
    result += '; HttpOnly';
  }

  if ( typeof options.Secure === 'undefined' || options.Secure ) {
    result += '; Secure';
  }

  if ( typeof options.Domain !== 'undefined' ) {
    result += '; Domain=' + options.Domain;
  }

  if ( typeof options.Path === 'undefined' ) {
    result += '; Path=/';
  } else {
    result += '; Path=' + options.Path;
  }

  return result;
};
