(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var defaults  = require( './defaults' ),
    urlencode = require( './urlencode' );

var hasOwnProperty = {}.hasOwnProperty;

var defaultOptions = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  },

  timeout: 1000 * 60,
  type: 'GET'
};

/**
 * Cross-browser XMLHttpRequest: https://stackoverflow.com/a/2557268
 */
function createHTTPRequest () {
  var HTTPFactories, i;

  HTTPFactories = [
    function () {
      return new XMLHttpRequest();
    },

    function () {
      return new ActiveXObject( 'Msxml3.XMLHTTP' );
    },

    function () {
      return new ActiveXObject( 'Msxml2.XMLHTTP.6.0' );
    },

    function () {
      return new ActiveXObject( 'Msxml2.XMLHTTP.3.0' );
    },

    function () {
      return new ActiveXObject( 'Msxml2.XMLHTTP' );
    },

    function () {
      return new ActiveXObject( 'Microsoft.XMLHTTP' );
    }
  ];

  for ( i = 0; i < HTTPFactories.length; ++i ) {
    try {
      return ( createHTTPRequest = HTTPFactories[ i ] )();
    } catch ( ex ) {}
  }

  throw Error( "Can't create a request object." );
}

function ajax ( path, options ) {
  var data = null,
      xhr = createHTTPRequest(),
      async, timeoutID, ContentType, name;

  // _.ajax( options );
  // async = options.async || true
  if ( typeof path !== 'string' ) {
    options = defaults( defaultOptions, path );
    async = ! ( 'async' in options ) || options.async;
    path = options.path;

  // _.ajax( path );
  // async = false
  } else if ( options == null ) {
    options = defaultOptions;
    async = false;

  // _.ajax( path, options );
  // async = options.async || true
  } else {
    options = defaults( defaultOptions, options );
    async = ! ( 'async' in options ) || options.async;
  }

  xhr.onreadystatechange = function () {
    var status;

    if ( this.readyState !== 4 ) {
      return;
    }

    status = this.status;

    // normalize status code in IE
    // https://stackoverflow.com/questions/10046972/
    if ( status === 1223 ) {
      status = 204;
    }

    if ( status === 200 ) {
      if ( timeoutID != null ) {
        clearTimeout( timeoutID );
      }

      data = this.responseText;

      if ( options.success ) {
        options.success.call( this, data, path, options );
      }
    } else if ( options.error ) {
      options.error.call( this, path, options );
    }
  };

  if ( options.type === 'POST' || 'data' in options ) {
    xhr.open( 'POST', path, async );
  } else {
    xhr.open( 'GET', path, async );
  }

  if ( options.headers ) {
    for ( name in options.headers ) {
      if ( ! hasOwnProperty.call( options.headers, name ) ) {
        continue;
      }

      if ( name === 'Content-Type' ) {
        ContentType = options.headers[ name ];
      }

      xhr.setRequestHeader( name, options.headers[ name ] );
    }
  }

  if ( async ) {
    timeoutID = setTimeout( function () {
      xhr.abort();
    }, options.timeout );
  }

  if ( ContentType != null && ( options.type === 'POST' || 'data' in options ) ) {
    if ( ! ContentType.indexOf( 'application/x-www-form-urlencoded' ) ) {
      xhr.send( urlencode( options.data ) );
    } else if ( ! ContentType.indexOf( 'application/json' ) ) {
      xhr.send( JSON.stringify( options.data ) );
    } else {
      xhr.send( options.data );
    }
  } else {
    xhr.send();
  }

  return data;
}

module.exports = ajax;

},{"./defaults":15,"./urlencode":44}],2:[function(require,module,exports){
'use strict';

var has = require( '../has' );

module.exports = function baseAccessor ( object, path, offset, value, setValue ) {
  var i = 0,
      len = path.length - offset,
      key, hasPath, last;

  if ( setValue ) {
    last = len - 1;
  }

  for ( ; i < len; ++i ) {
    hasPath = has( key = path[ i ], object );

    if ( setValue ) {
      if ( i === last ) {
        object = object[ key ] = value;
      } else if ( hasPath ) {
        object = object[ key ];
      } else {
        object = object[ key ] = {};
      }
    } else if ( hasPath ) {
      object = object[ key ];
    } else {
      return;
    }
  }

  return object;
};

},{"../has":19}],3:[function(require,module,exports){
'use strict';

var has = require( '../has' );

var defineGetter = Object.prototype.__defineGetter__,
    defineSetter = Object.prototype.__defineSetter__;

function baseDefineProperty ( object, key, descriptor ) {
  var hasGetter = has( 'get', descriptor ),
      hasSetter = has( 'set', descriptor ),
      get, set;

  if ( hasGetter || hasSetter ) {
    if ( hasGetter && typeof ( get = descriptor.get ) !== 'function' ) {
      throw TypeError( 'Getter must be a function: ' + get );
    }

    if ( hasSetter && typeof ( set = descriptor.set ) !== 'function' ) {
      throw TypeError( 'Setter must be a function: ' + set );
    }

    if ( has( 'writable', descriptor ) ) {
      throw TypeError( 'Invalid property descriptor. Cannot both specify accessors and a value or writable attribute' );
    }

    if ( defineGetter ) {
      if ( hasGetter ) {
        defineGetter.call( object, key, get );
      }

      if ( hasSetter ) {
        defineSetter.call( object, key, set );
      }
    } else {
      throw Error( "Can't define setter/getter" );
    }
  } else if ( has( 'value', descriptor ) || ! has( key, object ) ) {
    object[ key ] = descriptor.value;
  }

  return object;
}

module.exports = baseDefineProperty;

},{"../has":19}],4:[function(require,module,exports){
'use strict';

module.exports = function baseExec ( regexp, string ) {
  var result = [],
      value;

  regexp.lastIndex = 0;

  while ( ( value = regexp.exec( string ) ) ) {
    result.push( value );
  }

  return result;
};

},{}],5:[function(require,module,exports){
'use strict';

var has          = require( '../has' ),
    callIteratee = require( '../call-iteratee' );

module.exports = function baseForEach ( arr, fun, ctx, fromRight ) {
  var i = -1,
      j = arr.length - 1,
      index;

  for ( ; j >= 0; --j ) {
    if ( fromRight ) {
      index = j;
    } else {
      index = ++i;
    }

    if ( has( index, arr ) && callIteratee( fun, ctx, arr[ index ], index, arr ) === false ) {
      break;
    }
  }

  return arr;
};

},{"../call-iteratee":9,"../has":19}],6:[function(require,module,exports){
'use strict';

var callIteratee = require( '../call-iteratee' );

module.exports = function baseForIn ( object, iteratee, context, keys, fromRight ) {
  var i = -1,
      j = keys.length - 1,
      key;

  for ( ; j >= 0; --j ) {
    if ( fromRight ) {
      key = keys[ j ];
    } else {
      key = keys[ ++i ];
    }

    if ( callIteratee( iteratee, context, object[ key ], key, object ) === false ) {
      break;
    }
  }

  return object;
};

},{"../call-iteratee":9}],7:[function(require,module,exports){
'use strict';

var baseToIndex = require( './base-to-index' );

var arr = [];

function baseIndexOf ( iterable, search, fromIndex, fromRight ) {
  var length, i, j, index, value;

  // use the native functions if supported and the search is not nan.
  if ( arr.indexOf && search === search ) {
    if ( ! fromRight ) {
      return arr.indexOf.call( iterable, search, fromIndex );
    }

    if ( arr.lastIndexOf ) {
      return arr.lastIndexOf.call( iterable, search, fromIndex );
    }
  }

  length = iterable.length;

  // if the iterable is empty then just return -1.
  if ( ! length ) {
    return -1;
  }

  j = length - 1;

  if ( fromIndex !== undefined ) {
    fromIndex = baseToIndex( fromIndex, length );

    if ( fromRight ) {
      j = Math.min( j, fromIndex );
    } else {
      j = Math.max( 0, fromIndex );
    }

    i = j - 1;
  } else {
    i = -1;
  }

  for ( ; j >= 0; --j ) {
    if ( fromRight ) {
      index = j;
    } else {
      index = ++i;
    }

    value = iterable[ index ];

    if ( value === search || value !== value && search !== search ) {
      return index;
    }
  }

  return -1;
}

module.exports = baseIndexOf;

},{"./base-to-index":8}],8:[function(require,module,exports){
'use strict';

module.exports = function baseToIndex ( value, length ) {
  if ( ! length || ! value ) {
    return 0;
  }

  if ( value < 0 ) {
    value += length;
  }

  return value || 0;
};

},{}],9:[function(require,module,exports){
'use strict';

module.exports = function callIteratee ( fun, ctx, val, key, obj ) {
  if ( ctx === undefined ) {
    return fun( val, key, obj );
  }

  return fun.call( ctx, val, key, obj );
};

},{}],10:[function(require,module,exports){
'use strict';

var create         = require( './create' ),
    getPrototypeOf = require( './get-prototype-of' ),
    toObject       = require( './to-object' ),
    each           = require( './each' ),
    isPrimitive    = require( './is-primitive' );

module.exports = function clone ( deep, target, guard ) {
  var cln;

  if ( target === undefined || guard ) {
    target = deep;
    deep = true;
  }

  cln = create( getPrototypeOf( target = toObject( target ) ) );

  each( target, function ( value, key, target ) {
    if ( value === target ) {
      this[ key ] = this;
    } else if ( deep && ! isPrimitive( value ) ) {
      this[ key ] = clone( deep, value );
    } else {
      this[ key ] = value;
    }
  }, cln );

  return cln;
};

},{"./create":12,"./each":17,"./get-prototype-of":18,"./is-primitive":28,"./to-object":40}],11:[function(require,module,exports){
'use strict';

module.exports = {
  ERR: {
    INVALID_ARGS:          'Invalid arguments',
    FUNCTION_EXPECTED:     'Expected a function',
    STRING_EXPECTED:       'Expected a string',
    UNDEFINED_OR_NULL:     'Cannot convert undefined or null to object',
    REDUCE_OF_EMPTY_ARRAY: 'Reduce of empty array with no initial value'
  },

  MAX_ARRAY_LENGTH: 4294967295,
  MAX_SAFE_INT:     9007199254740991,
  MIN_SAFE_INT:     -9007199254740991
};

},{}],12:[function(require,module,exports){
'use strict';

var isPrimitive      = require( './is-primitive' ),
    setPrototypeOf   = require( './set-prototype-of' ),
    defineProperties = require( './define-properties' );

function Constructor () {}

module.exports = Object.create || function create ( prototype, descriptors ) {
  var object;

  if ( prototype !== null && isPrimitive( prototype ) ) {
    throw TypeError( 'Object prototype may only be an Object or null: ' + prototype );
  }

  Constructor.prototype = prototype;

  object = new Constructor();

  Constructor.prototype = null;

  if ( prototype === null ) {
    setPrototypeOf( object, prototype );
  }

  if ( arguments.length >= 2 ) {
    defineProperties( object, descriptors );
  }

  return object;
};

},{"./define-properties":16,"./is-primitive":28,"./set-prototype-of":37}],13:[function(require,module,exports){
'use strict';

var toObject     = require( '../to-object' ),
    isArrayLike  = require( '../is-array-like' ),
    baseForEach  = require( '../base/base-for-each' ),
    baseForIn    = require( '../base/base-for-in' ),
    getKeys      = require( '../keys' ),
    wrapIteratee = require( '../iteratee' );

module.exports = function createEach ( fromRight ) {
  return function ( iterable, iteratee, context ) {
    iterable = toObject( iterable );
    iteratee = wrapIteratee( iteratee );

    if ( isArrayLike( iterable ) ) {
      return baseForEach( iterable, iteratee, context, fromRight );
    }

    return baseForIn( iterable, iteratee, context, getKeys( iterable ), fromRight );
  };
};

},{"../base/base-for-each":5,"../base/base-for-in":6,"../is-array-like":21,"../iteratee":31,"../keys":32,"../to-object":40}],14:[function(require,module,exports){
'use strict';

var baseIndexOf = require( '../base/base-index-of' ),
    toObject = require( '../to-object' );

module.exports = function createIndexOf ( fromRight ) {
  return function ( iterable, search, fromIndex ) {
    return baseIndexOf( toObject( iterable ), search, fromIndex, fromRight );
  };
};

},{"../base/base-index-of":7,"../to-object":40}],15:[function(require,module,exports){
'use strict';

var mixin = require( './mixin' ),
    clone = require( './clone' );

module.exports = function defaults ( defaults, object ) {
  return mixin( true, clone( true, defaults ), object );
};

},{"./clone":10,"./mixin":33}],16:[function(require,module,exports){
'use strict';

var support = require( './support/support-define-property' );

var defineProperties, baseDefineProperty, isPrimitive, each;

if ( support !== 'full' ) {
  isPrimitive        = require( './is-primitive' );
  each               = require( './each' );
  baseDefineProperty = require( './base/base-define-property' );

  defineProperties = function defineProperties ( object, descriptors ) {
    if ( support !== 'not-supported' ) {
      try {
        return Object.defineProperties( object, descriptors );
      } catch ( e ) {}
    }

    if ( isPrimitive( object ) ) {
      throw TypeError( 'defineProperties called on non-object' );
    }

    if ( isPrimitive( descriptors ) ) {
      throw TypeError( 'Property description must be an object: ' + descriptors );
    }

    each( descriptors, function ( descriptor, key ) {
      if ( isPrimitive( descriptor ) ) {
        throw TypeError( 'Property description must be an object: ' + descriptor );
      }

      baseDefineProperty( this, key, descriptor );
    }, object );

    return object;
  };
} else {
  defineProperties = Object.defineProperties;
}

module.exports = defineProperties;

},{"./base/base-define-property":3,"./each":17,"./is-primitive":28,"./support/support-define-property":38}],17:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-each' )();

},{"./create/create-each":13}],18:[function(require,module,exports){
'use strict';

var getType = require( './type' ),
    ERR     = require( './constants' ).ERR;

module.exports = Object.getPrototypeOf || function getPrototypeOf ( obj ) {
  var prototype;

  if ( obj == null ) {
    throw TypeError( ERR.UNDEFINED_OR_NULL );
  }

  // jshint proto: true
  prototype = obj.__proto__;
  // jshint proto: false

  if ( prototype !== undefined ) {
    return prototype;
  }

  if ( getType( obj.constructor ) === 'function' ) {
    return obj.constructor.prototype;
  }

  return obj;
};

},{"./constants":11,"./type":42}],19:[function(require,module,exports){
'use strict';

module.exports = function has ( key, obj ) {
  if ( obj == null ) {
    return false;
  }

  return obj[ key ] !== undefined || key in obj;
};

},{}],20:[function(require,module,exports){
'use strict';

module.exports = require( './create/create-index-of' )();

},{"./create/create-index-of":14}],21:[function(require,module,exports){
'use strict';

var isLength     = require( './is-length' ),
    isWindowLike = require( './is-window-like' );

module.exports = function isArrayLike ( value ) {
  if ( value == null ) {
    return false;
  }

  if ( typeof value === 'object' ) {
    return isLength( value.length ) && !isWindowLike( value );
  }

  return typeof value === 'string';
};

},{"./is-length":24,"./is-window-like":30}],22:[function(require,module,exports){
'use strict';

var isObjectLike = require( './is-object-like' ),
    isLength = require( './is-length' );

var toString = {}.toString;

module.exports = Array.isArray || function isArray ( value ) {
  return isObjectLike( value ) &&
    isLength( value.length ) &&
    toString.call( value ) === '[object Array]';
};

},{"./is-length":24,"./is-object-like":25}],23:[function(require,module,exports){
'use strict';

var isArray  = require( './is-array' ),
    rDeepKey = require( './regexps' ).deepKey;

module.exports = function isKey ( value ) {
  var type;

  if ( ! value ) {
    return true;
  }

  if ( isArray( value ) ) {
    return false;
  }

  type = typeof value;

  if ( type === 'number' || type === 'symbol' || type === 'boolean' ) {
    return true;
  }

  return ! rDeepKey.test( value );
};

},{"./is-array":22,"./regexps":36}],24:[function(require,module,exports){
'use strict';

var MAX_ARRAY_LENGTH = require( './constants' ).MAX_ARRAY_LENGTH;

module.exports = function isLength ( value ) {
  return typeof value === 'number' &&
    value >= 0 &&
    value <= MAX_ARRAY_LENGTH &&
    value % 1 === 0;
};

},{"./constants":11}],25:[function(require,module,exports){
'use strict';

module.exports = function isObjectLike ( value ) {
  return !! value && typeof value === 'object';
};

},{}],26:[function(require,module,exports){
'use strict';

var isObjectLike = require( './is-object-like' );

var toString = {}.toString;

module.exports = function isObject ( value ) {
  return isObjectLike( value ) &&
    toString.call( value ) === '[object Object]';
};

},{"./is-object-like":25}],27:[function(require,module,exports){
'use strict';

var isObject       = require( './is-object' ),
    getPrototypeOf = require( './get-prototype-of' );

var hasOwnProperty = {}.hasOwnProperty,
    fnToString = hasOwnProperty.toString;

var fnObject = fnToString.call( Object );

module.exports = function isPlainObject ( value ) {
  var prototype;

  if ( ! isObject( value ) ) {
    return false;
  }

  prototype = getPrototypeOf( value );

  return prototype === null ||
    hasOwnProperty.call( prototype, 'constructor' ) &&
    fnToString.call( prototype.constructor ) === fnObject;
};

},{"./get-prototype-of":18,"./is-object":26}],28:[function(require,module,exports){
'use strict';

module.exports = function isPrimitive ( value ) {
  return ! value ||
    typeof value !== 'object' &&
    typeof value !== 'function';
};

},{}],29:[function(require,module,exports){
'use strict';

var isObjectLike = require( './is-object-like' );

var toString = {}.toString;

module.exports = function isSymbol ( value ) {
  // disable "Invalid typeof value 'symbol' (W122)" (esversion: 3)
  // jshint -W122
  return typeof value === 'symbol' ||
  // jshint +W122
    isObjectLike( value ) &&
    toString.call( value ) === '[object Symbol]';
};

},{"./is-object-like":25}],30:[function(require,module,exports){
'use strict';

var isObjectLike = require( './is-object-like' );

module.exports = function isWindowLike ( value ) {
  return isObjectLike( value ) && value.window === value;
};

},{"./is-object-like":25}],31:[function(require,module,exports){
'use strict';

var isKey    = require( './is-key' ),
    property = require( './property' ),
    ERR      = require( './constants' ).ERR;

module.exports = function iteratee ( value ) {
  if ( typeof value === 'function' ) {
    return value;
  }

  if ( isKey( value ) ) {
    return property( value );
  }

  throw TypeError( ERR.FUNCTION_EXPECTED );
};

},{"./constants":11,"./is-key":23,"./property":35}],32:[function(require,module,exports){
'use strict';

var toObject = require( './to-object' ),
    indexOf = require( './index-of' );

var hasOwnProperty = {}.hasOwnProperty;

var getKeys, support, notEnumerables, fixKeys, baseKeys;

if ( Object.keys ) {
  try {
    support = Object.keys( '' ), 'es2015';
  } catch ( e ) {
    support = 'es5';
  }
} else if ( { toString: null }.propertyIsEnumerable( 'toString' ) ) {
  support = 'not-supported';
} else {
  support = 'has-a-bug';
}

// Base implementation of `Object.keys` polyfill.
if ( support !== 'es2015' ) {
  if ( support === 'not-supported' ) {
    notEnumerables = [
      'toString',
      'toLocaleString',
      'valueOf',
      'hasOwnProperty',
      'isPrototypeOf',
      'propertyIsEnumerable',
      'constructor'
    ];

    fixKeys = function fixKeys ( keys, object ) {
      var i = notEnumerables.length - 1,
          key;

      for ( ; i >= 0; --i ) {
        key = notEnumerables[ i ];

        if ( indexOf( keys, key ) < 0 && hasOwnProperty.call( object, key ) ) {
          keys.push( key );
        }
      }

      return keys;
    };
  }

  baseKeys = function baseKeys ( object ) {
    var keys = [],
        key;

    for ( key in object ) {
      if ( hasOwnProperty.call( object, key ) ) {
        keys.push( key );
      }
    }

    if ( support !== 'not-supported' ) {
      return keys;
    }

    return fixKeys( keys, object );
  };
}

if ( support !== 'es2015' ) {
  getKeys = function ( val ) {
    return baseKeys( toObject( val ) );
  };
} else {
  getKeys = Object.keys;
}

module.exports = getKeys;

},{"./index-of":20,"./to-object":40}],33:[function(require,module,exports){
'use strict';

var toObject      = require( './to-object' ),
    getKeys       = require( './keys' ),
    isPlainObject = require( './is-plain-object' ),
    isArray       = require( './is-array' );

function mixin ( deep, target ) {
  var length = arguments.length,
      i, keys, exp, j, k, val, key, nowArray, src, targetIsArray;

  // example: mixin( {}, {} )
  if ( typeof deep !== 'boolean' ) {
    target = deep;
    deep = true;
    i = 1;
  // example: mixin( false, {}, {} )
  // NOTE: use assign( {}, {} ) function instead.
  } else {
    i = 2;
  }

  // example:
  // var extendable = {
  //   extend: require( 'peako/mixin' )
  // };

  // extendable.extend( { name: 'Extendable Object' } );
  if ( i === length ) {
    target = this;
    --i;
  }

  // targetIsArray = isArray( target = toObject( target ) );
  target = toObject( target );

  // loop through all expanders.
  for ( ; i < length; ++i ) {
    keys = getKeys( exp = toObject( arguments[ i ] ) );

    // loop through all expander's properties.
    for ( j = 0, k = keys.length; j < k; ++j ) {
      val = exp[ key = keys[ j ] ];

      // fall into recursion
      if ( deep && val !== exp && ( isPlainObject( val ) || ( nowArray = isArray( val ) ) ) ) {
        src = target[ key ];

        if ( nowArray ) {
          // don't replace the source if it's already an array.
          if ( ! isArray( src ) ) {
            src = [];
          }

          nowArray = false;
        // don't replace the source if it's already an abject.
        } else if ( ! isPlainObject( src ) ) {
          src = {};
        }

        // extend the source (recursion).
        target[ key ] = mixin( true, src, val );
      // just assign the value
      } else {
        target[ key ] = val;
      }
    }
  }

  return target;
}

module.exports = mixin;

},{"./is-array":22,"./is-plain-object":27,"./keys":32,"./to-object":40}],34:[function(require,module,exports){
'use strict';

module.exports = function noop () {};

},{}],35:[function(require,module,exports){
'use strict';

var toPath       = require( './to-path' ),
    baseAccessor = require( './base/base-accessor' ),
    noop         = require( './noop' );

module.exports = function property ( path ) {
  var len = ( path = toPath( path ) ).length;

  if ( len > 1 ) {
    return function ( object ) {
      if ( object != null ) {
        return baseAccessor( object, path, 0 );
      }
    };
  }

  if ( len ) {
    return function ( object ) {
      if ( object != null ) {
        return object[ path ];
      }
    };
  }

  return noop;
};

},{"./base/base-accessor":2,"./noop":34,"./to-path":41}],36:[function(require,module,exports){
'use strict';

module.exports = {
  selector:  /^(?:#([\w-]+)|([\w-]+)|\.([\w-]+))$/,
  property:  /(^|\.)\s*([_a-z]\w*)\s*|\[\s*((?:-)?(?:\d+|\d*\.\d+)|("|')(([^\\]\\(\\\\)*|[^\4])*)\4)\s*\]/gi,
  deepKey:   /(^|[^\\])(\\\\)*(\.|\[)/,
  singleTag: /^(<([\w-]+)><\/[\w-]+>|<([\w-]+)(?:\s*\/)?>)$/,
  notSpaces: /[^\s\uFEFF\xA0]+/g
};

},{}],37:[function(require,module,exports){
'use strict';

var isPrimitive = require( './is-primitive' ),
    ERR         = require( './constants' ).ERR;

module.exports = Object.setPrototypeOf || function setPrototypeOf ( target, prototype ) {
  if ( target == null ) {
    throw TypeError( ERR.UNDEFINED_OR_NULL );
  }

  if ( prototype !== null && isPrimitive( prototype ) ) {
    throw TypeError( 'Object prototype may only be an Object or null: ' + prototype );
  }

  if ( ! isPrimitive( target ) && '__proto__' in target ) {
    // jshint proto: true
    target.__proto__ = prototype;
    // jshint proto: false
  }

  return target;
};

},{"./constants":11,"./is-primitive":28}],38:[function(require,module,exports){
'use strict';

var support;

function test ( target ) {
  try {
    if ( '' in Object.defineProperty( target, '', {} ) ) {
      return true;
    }
  } catch ( e ) {}

  return false;
}

if ( test( {} ) ) {
  support = 'full';
} else if ( typeof document !== 'undefined' && test( document.createElement( 'span' ) ) ) {
  support = 'dom';
} else {
  support = 'not-supported';
}

module.exports = support;

},{}],39:[function(require,module,exports){
'use strict';

var unescape = require( './unescape' ),
    isSymbol = require( './is-symbol' );

module.exports = function toKey ( val ) {
  var key;

  if ( typeof val === 'string' ) {
    return unescape( val );
  }

  if ( isSymbol( val ) ) {
    return val;
  }

  key = '' + val;

  if ( key === '0' && 1 / val === -Infinity ) {
    return '-0';
  }

  return unescape( key );
};

},{"./is-symbol":29,"./unescape":43}],40:[function(require,module,exports){
'use strict';

var ERR = require( './constants' ).ERR;

module.exports = function toObject ( value ) {
  if ( value == null ) {
    throw TypeError( ERR.UNDEFINED_OR_NULL );
  }

  return Object( value );
};

},{"./constants":11}],41:[function(require,module,exports){
'use strict';

var isKey     = require( './is-key' ),
    toKey     = require( './to-key' ),
    isArray   = require( './is-array' ),
    unescape  = require( './unescape' ),
    baseExec  = require( './base/base-exec' ),
    rProperty = require( './regexps' ).property;

function stringToPath ( string ) {
  var path = baseExec( rProperty, string ),
      i = path.length - 1,
      value;

  for ( ; i >= 0; --i ) {
    value = path[ i ];

    // .name
    if ( value[ 2 ] ) {
      path[ i ] = value[ 2 ];
    // [ "" ] || [ '' ]
    } else if ( value[ 5 ] != null ) {
      path[ i ] = unescape( value[ 5 ] );
    // [ 0 ]
    } else {
      path[ i ] = value[ 3 ];
    }
  }

  return path;
}

module.exports = function toPath ( value ) {
  var parsed, len, i;

  if ( isKey( value ) ) {
    return [
      toKey( value )
    ];
  }

  if ( isArray( value ) ) {
    parsed = Array( len = value.length );

    for ( i = len - 1; i >= 0; --i ) {
      parsed[ i ] = toKey( value[ i ] );
    }
  } else {
    parsed = stringToPath( '' + value );
  }

  return parsed;
};

},{"./base/base-exec":4,"./is-array":22,"./is-key":23,"./regexps":36,"./to-key":39,"./unescape":43}],42:[function(require,module,exports){
'use strict';

var create = require( './create' );

var toString = {}.toString,
    types = create( null );

module.exports = function getType ( value ) {
  var type, tag;

  if ( value === null ) {
    return 'null';
  }

  if ( value === undefined ) {
    return 'undefined';
  }

  if ( typeof value !== 'object' && typeof value !== 'function' ) {
    return typeof value;
  }

  type = types[ tag = toString.call( value ) ];

  if ( type ) {
    return type;
  }

  return ( types[ tag ] = tag.slice( 8, -1 ).toLowerCase() );
};

},{"./create":12}],43:[function(require,module,exports){
'use strict';

module.exports = function unescape ( string ) {
  return string.replace( /\\(\\)?/g, '$1' );
};

},{}],44:[function(require,module,exports){
'use strict';

var isArray = require( './is-array' ),
    isObject = require( './is-object' ),
    isObjectLike = require( './is-object-like' );

var hasOwnProperty = {}.hasOwnProperty;

/**
 * @param {String} key
 * @param {*} val
 * @returns {String}
 * @example
 * param( 'name', 'John' ); // -> 'name=John'
 */
function param ( key, val ) {
  var param = encodeURIComponent( key ) + '=';

  if ( val != null ) {
    param += encodeURIComponent( val );
  }

  return param;
}

function build ( params, obj, prefix ) {
  var key, i, l;

  if ( isArray( obj ) ) {
    for ( i = 0, l = obj.length; i < l; ++i ) {
      if ( /\[\]$/.test( prefix ) ) {
        params.push( param( prefix, obj[ i ] ) );
      } else if ( isObjectLike( obj[ i ] ) ) {
        build( params, obj[ i ], prefix + '[' + i + ']' );
      } else {
        build( params, obj[ i ], prefix + '[]' );
      }
    }
  } else if ( isObject( obj ) ) {
    for ( key in obj ) {
      if ( hasOwnProperty.call( obj, key ) ) {
        build( params, obj[ key ], prefix + '[' + key + ']' );
      }
    }
  } else {
    params.push( param( prefix, obj ) );
  }
}

function urlencode ( data ) {
  var params = [],
      prefix;

  for ( prefix in data ) {
    if ( hasOwnProperty.call( data, prefix ) ) {
      build( params, data[ prefix ], prefix );
    }
  }

  return params.join( '&' );
}

module.exports = urlencode;

},{"./is-array":22,"./is-object":26,"./is-object-like":25}],45:[function(require,module,exports){
// Generated by CoffeeScript 2.3.1
(function() {
  'use strict';
  var ajax;

  ajax = require('peako/ajax');

  console.log('It works!');

  signup.onsubmit = function(event) {
    var data;
    event.preventDefault();
    data = {
      username: username.value,
      password: password.value
    };
    ajax('/sign-up', {
      success: function(data) {
        return console.log('Successfully sent');
      },
      error: function() {
        return console.error('Error %d: "%s"', this.status, this.statusText);
      },
      // headers:
      //   'Content-Type': 'application/json'
      data: data
    });
    return console.log('Sent', data);
  };

}).call(this);

},{"peako/ajax":1}]},{},[45]);
