'use strict';

const { Client } = require( 'pg' );
const escape = require( 'peako/escape' );

exports.client = new Client( require( '../config' ) );
exports.client.connect();

exports.query = ( config, values ) => {
  return exports.client.query( config, ( values || config.values ).map( escape ) );
};

exports.user = ( id, user ) => {
  let key;

  if ( /^(\d+)$/.test( id ) ) {
    key = 'id';
  } else {
    key = 'alias';
  }

  if ( user && '' + user[ id ] === id ) {
    return Promise.resolve( { rows: [ user ] } );
  }

  return exports.query( `SELECT id, username, active, status, alias, sex FROM users WHERE ${key} = $1;`, [ id ] );
};
