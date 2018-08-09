'use strict';

var toString = Object.prototype.toString;

function Route ( path ) {
  var _params = [];

  if ( typeof path === 'string' ) {
    this.path = path;

    if ( path !== '*' ) {
      path = path.replace( /:([_a-z$][\w$]*)/gi, function ( match, name ) {

        if ( ~ _params.indexOf( name ) ) {
          throw Error( '"' + name + '" parameter already exists' );
        }

        _params.push( name );

        return '([^/]+)';

      } );

      this._pattern$ = RegExp( '^' + path + '/?$' );
      this._pattern  = RegExp( '^' + path + '/?' );
    } else {
      this._pattern = /^[^]*$/;
    }
  } else if ( path instanceof RegExp ) {
    this._pattern = path;
  } else {
    throw TypeError( 'expected a string or regexp, but got ' + Object.prototype.toString.call( path ) );
  }

  this._handlers = {};
  this._params   = _params;
}

Route.prototype = {
  _handle: function _handle ( request, response, next, error, _argslen ) {
    var handler = this._handlers.ALL || this._handlers[ request.method ];

    if ( handler.length === 4 ) {
      return handler( error, request, response, next );
    }

    if ( _argslen ) {
      return next( error );
    }

    return handler( request, response, next );
  },

  _handles: function _handles ( request ) {
    if ( typeof this._handlers.ALL === 'undefined' &&
         typeof this._handlers[ request.method ] === 'undefined' )
    {
      return false;
    }

    return ( this._pattern$ || this._pattern ).test( request.url );
  },

  _process: function _process ( request ) {
    var match, i, l;

    request.params = {};

    if ( this._params.length ) {
      match = this._pattern.exec( request.url );

      for ( i = 0, l = this._params.length; i < l; ++i ) {
        request.params[ this._params[ i ] ] = match[ i + 1 ];
      }
    }

    return this;
  },

  _matches: function _matches ( path ) {
    if ( this.path ) {
      return this.path === '*' || this.path === path;
    }

    return this._pattern.source === path.source;
  },

  constructor: Route
};

require( './methods' ).concat( 'ALL' ).forEach( function ( method ) {
  Route.prototype[ method.toLowerCase() ] = function ( handler ) {
    if ( typeof handler !== 'function' ) {
      throw TypeError( toString.call( handler ) + ' is not a function' );
    }

    if ( this._handlers[ method ] || arguments.length > 1 ) {
      throw Error( 'multiple method handlers not implemented. use another route for this' );
    }

    if ( this._handlers.ALL ) {
      throw Error( 'adding a handler to another method when ALL exists does not make sense' );
    }

    this._handlers[ method ] = handler;

    return this;
  };
} );

module.exports = Route;
