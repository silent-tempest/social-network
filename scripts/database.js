'use strict';

const { Client } = require( 'pg' );
const escape = require( 'peako/escape' );
const config = require( '../config/pg' );

exports.client = new Client( config );
exports.client.connect();

exports.query = ( query, values ) => {
  return exports.client.query( query, ( values || query.values ).map( escape ) );
};

exports.user = ( id, maybeUser ) => {
  let key;

  if ( /^(\d+)$/.test( id ) ) {
    key = 'id';
  } else {
    key = 'alias';
  }

  if ( maybeUser && '' + maybeUser[ key ] === id ) {
    return Promise.resolve( { rows: [ maybeUser ] } );
  }

  return exports.query( `SELECT id, username, active, status, alias, sex FROM users WHERE ${key} = $1;`, [ id ] );
};
