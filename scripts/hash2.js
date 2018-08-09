'use strict';

const { randomBytes, pbkdf2 } = require( 'crypto' );

// on my machine takes about one second
const ITERATIONS = 1e6;
const KEYLEN = 64;
const DIGEST = 'sha512';

exports.bytes = ( number ) => {
  return new Promise( ( resolve, reject ) => {
    randomBytes( number, ( error, bytes ) => {
      if ( error ) {
        reject( error );
      } else {
        resolve( bytes.toString( 'hex' ) );
      }
    } );
  } );
};

exports.create = ( password ) => {
  let secret, salt;

  return Promise.all( [ exports.bytes( 16 ), exports.bytes( 16 ) ] )
    .then( ( bytes ) => {
      return hash( password, ( secret = bytes[ 0 ] ), ( salt = bytes[ 1 ] ) );
    } )
    .then( ( password ) => {
      return { secret, salt, password };
    } );
};

exports.matches = ( password, data ) => {
  return hash( password, data.secret, data.salt ).then( ( password ) => {
    return password === data.password;
  } );
};

const hash = ( password, secret, salt ) => {
  return new Promise( ( resolve, reject ) => {
    pbkdf2( salt + password + salt, secret, ITERATIONS, KEYLEN, DIGEST, ( error, password ) => {
      if ( error ) {
        reject( error );
      } else {
        resolve( password.toString( 'hex' ) );
      }
    } );
  } );
};
