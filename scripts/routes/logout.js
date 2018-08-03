'use strict';

var find  = require( 'peako/find' );
var Route = require( '../lib/Route' );
var write = require( '../write' );
var read  = require( '../read' );

var route = new Route( '/logout' );

route.get( function ( req, res ) {

  new Promise( function ( resolve, reject ) {
    if ( req.cookie.sessionid && req.cookie.userid ) {
      resolve( read( './data/users.json' ) );
    } else if ( req.cookie.sessionid || req.cookie.userid ) {
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
        ( user = find( users, [ 'id', req.cookie.userid ] ) ) &&
        ~ ( index = user.sessions.indexOf( req.cookie.sessionid ) ) )
      {

        user.sessions.splice( index, 1 );

        return write( './data/users.json', JSON.stringify( users, null, 2 ) );

      }
    } )
    .then( function () {
      var cookie = [];

      if ( req.cookie.sessionid ) {
        cookie.push( 'sessionid=' + '' + '; Secure; HttpOnly; Path=/' );
      }

      if ( req.cookie.userid ) {
        cookie.push( 'userid=' + '' + '; Secure; HttpOnly; Path=/' );
      }

      res.setHeader( 'Set-Cookie', cookie );
      res.redirect( '/' );
    } )
    .catch( function () {
      res.redirect( '/wrong/' );
    } );

} );

module.exports = route;
