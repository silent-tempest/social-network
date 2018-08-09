'use strict';

var crypto = require( 'crypto' );
var sample = require( 'peako/sample' );
var CHARS  = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$';

exports.create = function create ( original ) {
  var secret = _secret( 16 );
  var salt   = _secret( 16 );
  var p1     = sample( CHARS );
  var p2     = sample( CHARS );

  var data = {
    password: _password( original, secret, salt, p1, p2 ),
    secret,
    salt
  };

  return data;
};

exports.matches = function matches ( password, data ) {
  var l = CHARS.length - 1;
  var i, j, p1;

  for ( i = l; i >= 0; --i ) {
    for ( j = l, p1 = CHARS[ i ]; j >= 0; --j ) {
      if ( _password( password, data.secret, data.salt, p1, CHARS[ j ] ) === data.password ) {
        return true;
      }
    }
  }

  return false;
};

function _secret ( n ) {
  return crypto
    .randomBytes( n )
    .toString( 'hex' );
}

function _password ( password, secret, salt, p1, p2 ) {
  return crypto
    .createHmac( 'sha256', secret )
    .update( p1 + salt + p2 + p1 + password + p2 + salt )
    .digest( 'hex' );
}
