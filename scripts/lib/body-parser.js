'use strict';

let NetworkError = require( 'network-error' );
let LogicalError = require( 'logical-error' );
let parse        = require( 'qs/lib/parse' );
let mime         = require( 'mime' );

let types = {
  'URLENCODED': 'application/x-www-form-urlencoded'
};

function parser ( options = {} ) {
  if ( ! options.extensions ) {
    throw Error( 'no `options.extensions` provided' );
  }

  let max = {};

  for ( let i = options.extensions.length - 1; i >= 0; --i ) {
    let extension = options.extensions[ i ];
    let type      = mime.getType( extension ) || types[ extension ] || types[ extension.toUpperCase() ];

    if ( ! type ) {
      throw LogicalError( `parser(options: object)', 'Unsupported Media Type "${type}"` );
    }

    max[ type ] = options.max && options.max[ extension ]
      ? options.max[ extension ]
      : 1024 * 1024;
  }

  function parseBody ( request, response, next ) {
    request.rawBody = Buffer( 0 );
    request.body    = '';

    if ( request.method !== 'POST' ) {
      return next();
    }

    let length = + request.headers[ 'content-length' ];
    let type   = request.headers[ 'content-type' ];
    let status;

    if ( ! type || ! max[ type ] && ! max[ type = type.split( ';' )[ 0 ] ] ) {
      status = 415; // Unsupported Media Type
    } else if ( isNaN( length ) ) {
      status = 411; // Length Required
    } else if ( length > max[ type ] ) {
      status = 413; // Payload Too Large
    }

    if ( status ) {
      return next( new NetworkError( status ) );
    }

    let chunks     = [];
    let bodyLength = 0;

    function ondata ( chunk ) {
      if ( ( bodyLength += chunk.length ) > length ) {
        throw new NetworkError( 413 );
      }

      chunks.push( chunk );
    }

    function onend ( error ) {
    // jshint validthis: true
      try {
        if ( error ) {
          throw error instanceof NetworkError
            ? error
            : NetworkError.from( error );
        }

        if ( bodyLength !== length ) {
          throw new NetworkError( 400 );
        }

        this.rawBody = Buffer.concat( chunks );

        if ( type === 'application/json' ) {
          this.body = JSON.parse( this.rawBody );
        } else if ( type === 'application/x-www-form-urlencoded' ) {
          this.body = parse( '' + this.rawBody );
        }

        next();
      } catch ( error ) {
        if ( error instanceof NetworkError === false ) {
          error = new NetworkError( 422 ); // jshint ignore: line
        }

        next( error );
      } finally {
        this
          .removeListener( 'data', ondata )
          .removeListener( 'end', onend );
      }
      // jshint validthis: false
    }

    request
      .on( 'data', ondata )
      .on( 'end', onend );
  }

  return parseBody;
}

module.exports = parser;
