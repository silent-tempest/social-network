'use strict';

var crypto = require( 'crypto' ),
    find   = require( 'peako/find' );

var AuthorizationError = require( '../AuthorizationError' ),
    constants          = require( '../constants' ),
    Route              = require( '../Route' ),
    user               = require( '../find-user' ),
    write              = require( '../write' ),
    read               = require( '../read' );

module.exports = new Route( '/login' ).post( function ( req, res ) {
  var _users, _user, _sessionid;

  return read( './data/users.json' )
    .then( function ( users ) {
      return ( _users = JSON.parse( users ) );
    } )
    .then( function ( users ) {
      return user( req.cookie, users, true );
    } )

    // user found

    .then( function ( user ) {
      _user = user;
      throw constants.ALREADY_AUTHORIZED;
    } )

    // user is not authorized

    .catch( function ( error ) {
      if ( error !== constants.NO_USER ) {
        throw error;
      }

      var username = req.body.username,
          password = req.body.password;

      if ( typeof username === 'undefined' || typeof password === 'undefined' ) {
        return res.redirect( '/wrong/status=400&message=great, super hacka!' );
      }

      _user = find( _users, [ 'username', username.trim() ] );

      if ( ! _user ) {
        throw new AuthorizationError( 'username', 'bad username' );
      }

      password = crypto
        .createHmac( 'sha512', _user.salt )
        .update( password )
        .digest( 'hex' );

      if ( password !== _user.password ) {
        throw new AuthorizationError( 'password', 'bad password' );
      }

      if ( typeof req.query.validate !== 'undefined' ) {
        throw constants.GOOD_INPUT;
      }

      _sessionid = crypto
        .randomBytes( 4 )
        .toString( 'hex' );

      _user.sessions.push( _sessionid );

      return write( './data/users.json', JSON.stringify( _users, null, 2 ) );
    } )

    // user authorized successfully

    .then( function () {

      var Expires = new Date( new Date().getTime() + 1000 * 60 * 60 * 24 * 365 ).toGMTString();

      res.setHeader( 'Set-Cookie', [
        'sessionid=' + _sessionid + '; Expires=' + Expires + '; Secure; httpOnly; Path=/',
        'userid=' + _user.id + '; Expires=' + Expires + '; Secure; httpOnly; Path=/'
      ] );

      res.redirect( '/user/' + ( _user.alias || _user.id ) + '/' );

    } )
    .catch( function ( error ) {

      if ( typeof req.query.validate !== 'undefined' ) {
        if ( error === constants.GOOD_INPUT ) {
          res.writeHead( 200, {
            'Content-Type': 'text/plain'
          } );

          res.end( '' );
        } else if ( error instanceof AuthorizationError ) {
          res.writeHead( 400, {
            'Content-Type': 'application/json'
          } );

          res.end( JSON.stringify( {
            fieldname: error.fieldname,
            message:   error.message
          } ) );
        } else {
          throw 500;
        }

        return;
      }

      // user already authorized

      if ( error === constants.ALREADY_AUTHORIZED ) {
        res.redirect( '/user/' + ( _user.alias || _user.id ) + '/' );

      // bad input

      } else if ( error instanceof AuthorizationError ) {
        res.redirect( '/?fieldname=' + error.fieldname + '&message=' + error.message );

      // internal error

      } else {
        res.redirect( '/wrong/?status=500&message=something went wrong' );
      }
    } );
} );
