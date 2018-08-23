'use strict';

let { readFileSync } = require( 'fs' );
let pg = require( './pg' );

if ( typeof pg === 'string' ) {
  pg = require( 'pg-connection-string' ).parse( pg );
}

exports.ssl = pg.ssl = {
  cert: readFileSync( './config/server.cert' ),
  key:  readFileSync( './config/server.key' )
};

exports.pg = pg;
