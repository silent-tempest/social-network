'use strict';

var crypto = require( 'crypto' ),
    fs     = require( 'fs' ),
    Route  = require( '../Route' );

module.exports = new Route( '/signup' ).post( function ( req, res ) {
  var username = req.body.username,
      password = req.body.password;

  var users, gender, salt, id;

  // hackers trying to make something bad LOL

  if ( typeof username === 'undefined' || typeof password === 'undefined' ) {
    return res.end();
  }

  username = username.trim();

  // validate the input

  if ( ! username.length ) {
    badInput( '#username', 'No username' );
  } else if ( username.length > 16 ) {
    badInput( '#username', 'The length of the username cannot exceed 16 characters' );
  } else if ( ! /^[\w\- ]+$/.test( username ) ) {
    badInput( '#username', 'The username must contain only letters (A-Z), digits (0-9), underscores, dashes, or spaces' );
  } else if ( /^\d*$/.test( username ) ) {
    badInput( '#username', 'The username must not consist of digits only' );
  } else if ( ( users = JSON.parse( fs.readFileSync( './data/users.json', 'utf8' ) ) ).some( ( user ) => user.username === username ) ) {
    badInput( '#username', 'The username is already taken, try another one.' );
  } else if ( password.length < 6 ) {
    badInput( '#password', 'The password must be at least 6 characters' );
  } else if ( password.length > 32 ) {
    badInput( '#password', 'The length of the password cannot exceed 32 characters' );
  } else if ( ! /[0-9]/.test( password ) ) {
    badInput( '#password', 'The password must contain at least one digit' );
  } else if ( ! /[a-z]/.test( password ) ) {
    badInput( '#password', 'The password must contain at least one lowercase character' );
  } else if ( ! /[A-Z]/.test( password ) ) {
    badInput( '#password', 'The password must contain at least one uppercase character' );
  } else if ( password !== req.body.confirmedPassword ) {
    badInput( '#password', 'The passwords do not match' );

  // the input is valid, so create an account

  } else {
    if ( req.body.gender === 'female' || req.body.gender === 'male' ) {
      gender = req.body.gender;
    } else {
      gender = 'unknown';
    }

    // create a salt (random hex string)

    salt = crypto
      .randomBytes( 16 )
      .toString( 'hex' );

    // create a hash using the salt

    password = crypto
      .createHmac( 'sha512', salt )
      .update( password )
      .digest( 'hex' );

    id = '' + users.length;

    users.push( {
      username,
      password,
      gender,
      logins: [],
      salt,
      id
    } );

    fs.writeFileSync( './data/users.json', JSON.stringify( users, null, 2 ) );

    res.writeHead( 200, {
      'Content-Type': 'application/json'
    } );

    res.end( JSON.stringify( {
      username,
      url: `/user/${id}/`
    } ) );
  }

  function badInput ( selector, message ) {

    res.writeHead( 400, {
      'Content-Type': 'application/json'
    } );

    res.end( JSON.stringify( { message, selector } ) );

  }
} );
