'use strict';

var crypto  = require( 'crypto' ),
    find    = require( 'peako/find' ),
    Route   = require( '../Route' ),
    layout  = require( '../layout' ),
    read    = require( '../read' ),
    write   = require( '../write' );

var route = new Route( '/login' );

route.get( function ( req, res ) {

  new Promise( function ( resolve ) {
    if ( req.cookie.login && req.cookie.id ) {
      resolve( read( './data/users.json' ) );
    } else {
      resolve();
    }
  } )
    .then( function ( users ) {
      if ( users ) {
        return JSON.parse( users );
      }
    } )
    .then( function ( users ) {
      if ( users ) {
        var user = find( users, [ 'id', req.cookie.id ] );

        if ( user && ~ user.logins.indexOf( req.cookie.login ) ) {
          throw 0;
        }
      }
    } )
    .then( function () {
      res.writeHead( 200, {
        'Content-Type': 'text/html'
      } );

      res.end( layout.render( 'login', null, [
        layout.link( './styles/material-design-components/build/index.min.css' )
      ], [
        layout.script( './build/login.js' )
      ] ) );
    } )
    .catch( function ( error ) {
      if ( error === 0 ) {
        res.redirect( '/user/' + req.cookie.id + '/' );
      } else {
        res.redirect( '/wrong/?status=500' );
      }
    } );

} );

route.post( function ( req, res ) {
  var username = req.body.username,
      password = req.body.password;

  var login, id;

  // hackers trying to make something bad LOL

  if ( typeof username === 'undefined' || typeof password === 'undefined' ) {
    return res.end();
  }

  username = username.trim();

  read( './data/users.json' )
    .then( function ( users ) {
      return JSON.parse( users );
    } )
    .then( function ( users ) {

      var user = users.find( function ( user ) {
        return user.username === username;
      } );

      if ( ! user ) {
        return badInput( '#username', 'Bad username' );
      }

      password = crypto
        .createHmac( 'sha512', user.salt )
        .update( password )
        .digest( 'hex' );

      if ( password !== user.password ) {
        return badInput( '#password', 'Bad password' );
      }

      login = crypto
        .randomBytes( 16 )
        .toString( 'hex' );

      id    = user.id;

      user.logins.push( login );

      return write( './data/users.json', JSON.stringify( users, null, 2 ) );

    } )
    .then( function () {

      var Expires = new Date( new Date().getTime() + 1000 * 60 * 60 * 24 * 365 ).toGMTString();

      res.writeHead( 200, {
        'Set-Cookie': [
          'login=' + login + '; Expires=' + Expires + '; Secure; httpOnly; Path=/',
          'id=' + id + '; Expires=' + Expires + '; Secure; httpOnly; Path=/'
        ]
      } );

      res.end();

    } )
    .catch( function ( e ) {
      console.log( e );
      res.statusCode = 500;
      res.end();
    } );

  function badInput ( selector, message ) {

    res.writeHead( 400, {
      'Content-Type': 'application/json'
    } );

    res.end( JSON.stringify( { message, selector } ) );

  }
} );

module.exports = route;
