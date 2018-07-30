'use strict';

var find    = require( 'peako/find' ),
    Route   = require( '../Route' ),
    read    = require( '../read' ),
    write   = require( '../write' );

var route = new Route( '/logout' );

route.get( function ( req, res ) {

  new Promise( function ( resolve, reject ) {
    if ( req.cookie.login && req.cookie.id ) {
      resolve( read( './data/users.json' ) );
    } else if ( req.cookie.login || req.cookie.id ) {
      resolve();
    } else {
      reject();
    }
  } )
    .then( function ( users ) {
      if ( users ) {
        return JSON.parse( users );
      }
    } )
    .then( function ( users ) {
      var user, index;

      if ( users &&
        ( user = find( users, [ 'id', req.cookie.id ] ) ) &&
        ~ ( index = user.logins.indexOf( req.cookie.login ) ) )
      {

        user.logins.splice( index, 1 );

        return write( './data/users.json', JSON.stringify( users, null, 2 ) );

      }
    } )
    .then( function () {
      var cookie = [];

      if ( req.cookie.login ) {
        cookie.push( 'login=' + '' + '; Secure; HttpOnly; Path=/' );
      }

      if ( req.cookie.id ) {
        cookie.push( 'id=' + '' + '; Secure; HttpOnly; Path=/' );
      }

      res.setHeader( 'Set-Cookie', cookie );
      res.redirect( '/' );
    } )
    .catch( function () {
      res.redirect( '/wrong/' );
    } );

} );

module.exports = route;
