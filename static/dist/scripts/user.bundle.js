(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var isArray = require('./is-array');

module.exports = function css(k, v) {
  if (isArray(k)) {
    return this.styles(k);
  }

  return this.style(k, v);
};

},{"./is-array":49}],2:[function(require,module,exports){
'use strict';

module.exports = function each(fun) {
  var len = this.length,
      i = 0;

  for (; i < len; ++i) {
    if (fun.call(this[i], i, this[i]) === false) {
      break;
    }
  }

  return this;
};

},{}],3:[function(require,module,exports){
'use strict';

var DOMWrapper = require('./DOMWrapper');

module.exports = function end() {
  return this._previous || new DOMWrapper();
};

},{"./DOMWrapper":14}],4:[function(require,module,exports){
'use strict';

module.exports = function eq(index) {
  return this.stack(this.get(index));
};

},{}],5:[function(require,module,exports){
'use strict';

module.exports = function first() {
  return this.eq(0);
};

},{}],6:[function(require,module,exports){
'use strict';

var clone = require('./base/base-clone-array');

module.exports = function get(index) {
  if (typeof index === 'undefined') {
    return clone(this);
  }

  if (index < 0) {
    return this[this.length + index];
  }

  return this[index];
};

},{"./base/base-clone-array":20}],7:[function(require,module,exports){
'use strict';

module.exports = function last() {
  return this.eq(-1);
};

},{}],8:[function(require,module,exports){
'use strict';

module.exports = function map(fun) {
  var els = this.stack(),
      len = this.length,
      el,
      i;

  els.length = this.length;

  for (i = 0; i < len; ++i) {
    els[i] = fun.call(el = this[i], i, el);
  }

  return els;
};

},{}],9:[function(require,module,exports){
'use strict';

var event = require('./event');

module.exports = function ready(cb) {
  var doc = this[0],
      readyState;

  if (!doc || doc.nodeType !== 9) {
    return this;
  }

  readyState = doc.readyState;

  if (doc.attachEvent ? readyState !== 'complete' : readyState === 'loading') {
    event.on(doc, 'DOMContentLoaded', null, function () {
      cb();
    }, false, true);
  } else {
    cb();
  }

  return this;
};

},{"./event":44}],10:[function(require,module,exports){
'use strict';

module.exports = function remove() {
  var i = this.length - 1,
      nodeType,
      parentNode;

  for (; i >= 0; --i) {
    nodeType = this[i].nodeType;

    if (nodeType !== 1 && nodeType !== 3 && nodeType !== 8 && nodeType !== 9 && nodeType !== 11) {
      continue;
    }

    if (parentNode = this[i].parentNode) {
      parentNode.removeChild(this[i]);
    }
  }

  return this;
};

},{}],11:[function(require,module,exports){
'use strict';

var baseCopyArray = require('./base/base-copy-array'),
    DOMWrapper = require('./DOMWrapper'),
    _first = require('./_first');

module.exports = function stack(elements) {
  var wrapper = new DOMWrapper();

  if (elements) {
    if (elements.length) {
      baseCopyArray(wrapper, elements).length = elements.length;
    } else {
      _first(wrapper, elements);
    }
  }

  wrapper._previous = wrapper.prevObject = this;

  return wrapper;
};

},{"./DOMWrapper":14,"./_first":16,"./base/base-copy-array":21}],12:[function(require,module,exports){
'use strict';

var isObjectLike = require('./is-object-like'),
    cssNumbers = require('./css-numbers'),
    getStyle = require('./get-style'),
    camelize = require('./camelize'),
    access = require('./access');

module.exports = function style(key, val) {

  var px = 'do-not-add';

  // Compute px or 'px' to `val` now.

  if (typeof k === 'string' && !cssNumbers[camelize(key)]) {
    if (typeof val === 'number') {
      val += 'px';
    } else if (typeof val === 'function') {
      px = 'got-a-function';
    }
  } else if (isObjectLike(key)) {
    px = 'got-an-object';
  }

  return access(this, function (element, key, val, chainable) {
    if (element.nodeType !== 1) {
      return null;
    }

    key = camelize(key);

    if (!chainable) {
      return getStyle(element, key);
    }

    if (typeof val === 'number' && (px === 'got-a-function' || px === 'got-an-object' && !cssNumbers[key])) {
      val += 'px';
    }

    element.style[key] = val;
  }, key, val, arguments.length > 1);
};

},{"./access":18,"./camelize":32,"./css-numbers":41,"./get-style":46,"./is-object-like":53}],13:[function(require,module,exports){
'use strict';

var camelize = require('./camelize');

module.exports = function styles(keys) {

  var element = this[0];

  var result = [];

  var i, l, computed, key, val;

  for (i = 0, l = keys.length; i < l; ++i) {

    key = keys[i];

    if (!computed) {
      val = element.style[key = camelize(key)];
    }

    if (!val) {
      if (!computed) {
        computed = getComputedStyle(element);
      }

      val = computed.getPropertyValue(key);
    }

    result.push(val);
  }

  return result;
};

},{"./camelize":32}],14:[function(require,module,exports){
'use strict';

// export before call recursive require

module.exports = DOMWrapper;

var isArrayLikeObject = require('./is-array-like-object'),
    isDOMElement = require('./is-dom-element'),
    baseForEach = require('./base/base-for-each'),
    baseForIn = require('./base/base-for-in'),
    parseHTML = require('./parse-html'),
    _first = require('./_first'),
    event = require('./event');

var undefined; // jshint ignore: line

var rSelector = /^(?:#([\w-]+)|([\w-]+)|\.([\w-]+))$/;

function DOMWrapper(selector) {
  var match, list, i;

  // _();

  if (!selector) {
    return;
  }

  // _( window );

  if (isDOMElement(selector)) {
    _first(this, selector);
    return;
  }

  if (typeof selector === 'string') {
    if (selector.charAt(0) !== '<') {
      match = rSelector.exec(selector);

      // _( 'a > b + c' );

      if (!match || !document.getElementsByClassName && match[3]) {
        list = document.querySelectorAll(selector);

        // _( '#id' );
      } else if (match[1]) {
        if (list = document.getElementById(match[1])) {
          _first(this, list);
        }

        return;

        // _( 'tag' );
      } else if (match[2]) {
        list = document.getElementsByTagName(match[2]);

        // _( '.class' );
      } else {
        list = document.getElementsByClassName(match[3]);
      }

      // _( '<div>' );
    } else {
      list = parseHTML(selector);
    }

    // _( [ ... ] );
  } else if (isArrayLikeObject(selector)) {
    list = selector;

    // _( function ( _ ) { ... } );
  } else if (typeof selector === 'function') {
    return new DOMWrapper(document).ready(selector);
  } else {
    throw TypeError('Got unexpected selector: ' + selector + '.');
  }

  if (!list) {
    return;
  }

  this.length = list.length;

  for (i = this.length - 1; i >= 0; --i) {
    this[i] = list[i];
  }
}

DOMWrapper.prototype = {
  each: require('./DOMWrapper#each'),
  end: require('./DOMWrapper#end'),
  eq: require('./DOMWrapper#eq'),
  first: require('./DOMWrapper#first'),
  get: require('./DOMWrapper#get'),
  last: require('./DOMWrapper#last'),
  map: require('./DOMWrapper#map'),
  ready: require('./DOMWrapper#ready'),
  remove: require('./DOMWrapper#remove'),
  stack: require('./DOMWrapper#stack'),
  style: require('./DOMWrapper#style'),
  styles: require('./DOMWrapper#styles'),
  css: require('./DOMWrapper#css'),
  constructor: DOMWrapper
};

baseForIn({
  trigger: 'trigger',
  off: 'off',
  one: 'on',
  on: 'on'
}, function (name, methodName) {
  DOMWrapper.prototype[methodName] = function (types, selector, listener, useCapture) {
    var removeAll = name === 'off' && !arguments.length;

    var one = name === 'one';

    var element, i, j, l;

    if (!removeAll) {
      if (!(types = types.match(/[^\s\uFEFF\xA0]+/g))) {
        return this;
      }

      l = types.length;
    }

    // off( types, listener, useCapture )
    // off( types, listener )

    if (name !== 'trigger' && typeof selector === 'function') {
      if (listener != null) {
        useCapture = listener;
      }

      listener = selector;
      selector = null;
    }

    if (typeof useCapture === 'undefined') {
      useCapture = false;
    }

    for (i = this.length - 1; i >= 0; --i) {
      element = this[i];

      if (removeAll) {
        event.off(element);
      } else {
        for (j = 0; j < l; ++j) {
          event[name](element, types[j], selector, listener, useCapture, one);
        }
      }
    }

    return this;
  };
}, undefined, true, ['trigger', 'off', 'one', 'on']);

baseForEach(['blur', 'focus', 'focusin', 'focusout', 'resize', 'scroll', 'click', 'dblclick', 'mousedown', 'mouseup', 'mousemove', 'mouseover', 'mouseout', 'mouseenter', 'mouseleave', 'change', 'select', 'submit', 'keydown', 'keypress', 'keyup', 'contextmenu', 'touchstart', 'touchmove', 'touchend', 'touchenter', 'touchleave', 'touchcancel', 'load'], function (eventType) {
  DOMWrapper.prototype[eventType] = function (arg) {
    var i, l;

    if (typeof arg !== 'function') {
      return this.trigger(eventType, arg);
    }

    for (i = 0, l = arguments.length; i < l; ++i) {
      this.on(eventType, arguments[i], false);
    }

    return this;
  };
}, undefined, true);

baseForIn({
  disabled: 'disabled',
  checked: 'checked',
  value: 'value',
  text: 'textContent' in document.body ? 'textContent' : 'innerText',
  html: 'innerHTML'
}, function (name, methodName) {
  DOMWrapper.prototype[methodName] = function (value) {
    var element, i;

    if (value == null) {
      if ((element = this[0]) && element.nodeType === 1) {
        return element[name];
      }

      return null;
    }

    for (i = this.length - 1; i >= 0; --i) {
      if ((element = this[i]).nodeType === 1) {
        element[name] = value;
      }
    }

    return this;
  };
}, undefined, true, ['disabled', 'checked', 'value', 'text', 'html']);

},{"./DOMWrapper#css":1,"./DOMWrapper#each":2,"./DOMWrapper#end":3,"./DOMWrapper#eq":4,"./DOMWrapper#first":5,"./DOMWrapper#get":6,"./DOMWrapper#last":7,"./DOMWrapper#map":8,"./DOMWrapper#ready":9,"./DOMWrapper#remove":10,"./DOMWrapper#stack":11,"./DOMWrapper#style":12,"./DOMWrapper#styles":13,"./_first":16,"./base/base-for-each":24,"./base/base-for-in":25,"./event":44,"./is-array-like-object":47,"./is-dom-element":50,"./parse-html":63}],15:[function(require,module,exports){
'use strict';

var baseAssign = require('./base/base-assign');

var isset = require('./isset');

var keys = require('./keys');

var defaults = ['altKey', 'bubbles', 'cancelable', 'cancelBubble', 'changedTouches', 'ctrlKey', 'currentTarget', 'detail', 'eventPhase', 'metaKey', 'pageX', 'pageY', 'shiftKey', 'view', 'char', 'charCode', 'key', 'keyCode', 'button', 'buttons', 'clientX', 'clientY', 'offsetX', 'offsetY', 'pointerId', 'pointerType', 'relatedTarget', 'returnValue', 'screenX', 'screenY', 'targetTouches', 'toElement', 'touches', 'isTrusted'];

function Event(original, options) {

  var i, k;

  if (typeof original === 'object') {

    for (i = defaults.length - 1; i >= 0; --i) {
      if (isset(k = defaults[i], original)) {
        this[k] = original[k];
      }
    }

    if (original.target) {
      if (original.target.nodeType === 3) {
        this.target = original.target.parentNode;
      } else {
        this.target = original.target;
      }
    }

    this.original = this.originalEvent = original;

    this.which = Event.which(original);
  } else {
    this.isTrusted = false;
  }

  if (typeof original === 'string') {
    this.type = original;
  } else if (typeof options === 'string') {
    this.type = options;
  }

  if (typeof options === 'object') {
    baseAssign(this, options, keys(options));
  }
}

Event.prototype = {
  preventDefault: function preventDefault() {
    if (this.original) {
      if (this.original.preventDefault) {
        this.original.preventDefault();
      } else {
        this.original.returnValue = false;
      }

      this.returnValue = this.original.returnValue;
    }
  },

  stopPropagation: function stopPropagation() {
    if (this.original) {
      if (this.original.stopPropagation) {
        this.original.stopPropagation();
      } else {
        this.original.cancelBubble = true;
      }

      this.cancelBubble = this.original.cancelBubble;
    }
  },

  constructor: Event
};

Event.which = function which(event) {

  if (event.which) {
    return event.which;
  }

  if (!event.type.indexOf('key')) {
    if (event.charCode != null) {
      return event.charCode;
    }

    return event.keyCode;
  }

  if (typeof event.button === 'undefined' || !/^(?:mouse|pointer|contextmenu|drag|drop)|click/.test(event.type)) {
    return null;
  }

  if (event.button & 1) {
    return 1;
  }

  if (event.button & 2) {
    return 3;
  }

  if (event.button & 4) {
    return 2;
  }

  return 0;
};

module.exports = Event;

},{"./base/base-assign":19,"./isset":57,"./keys":59}],16:[function(require,module,exports){
'use strict';

module.exports = function _first(wrapper, element) {
  wrapper[0] = element;
  wrapper.length = 1;
};

},{}],17:[function(require,module,exports){
'use strict';

var type = require('./type');

var lastRes = 'undefined',
    lastVal;

module.exports = function _type(val) {
  if (val === lastVal) {
    return lastRes;
  }

  return lastRes = type(lastVal = val);
};

},{"./type":70}],18:[function(require,module,exports){
'use strict';

var DOMWrapper = require('./DOMWrapper'),
    type = require('./type'),
    keys = require('./keys');

function access(obj, fn, key, val, chainable) {
  var bulk = key == null;

  var len = obj.length;

  var raw = false;

  var i, k, l, e;

  if (type(key) === 'object') {
    for (i = 0, k = keys(key), l = k.length; i < l; ++i) {
      access(obj, fn, k[i], key[k[i]], true);
    }

    chainable = true;
  } else if (typeof val !== 'undefined') {
    if (typeof val !== 'function') {
      raw = true;
    }

    if (bulk) {
      if (raw) {
        fn.call(obj, val);
        fn = null;
      } else {
        bulk = fn;

        fn = function (e, key, val) {
          return bulk.call(new DOMWrapper(e), val);
        };
      }
    }

    if (fn) {
      for (i = 0; i < len; ++i) {
        e = obj[i];

        if (raw) {
          fn(e, key, val, true);
        } else {
          fn(e, key, val.call(e, i, fn(e, key)), true);
        }
      }
    }

    chainable = true;
  }

  if (chainable) {
    return obj;
  }

  if (bulk) {
    return fn.call(obj);
  }

  if (len) {
    return fn(obj[0], key);
  }

  return null;
}

module.exports = access;

},{"./DOMWrapper":14,"./keys":59,"./type":70}],19:[function(require,module,exports){
'use strict';

module.exports = function baseAssign(obj, src, k) {
  var i, l;

  for (i = 0, l = k.length; i < l; ++i) {
    obj[k[i]] = src[k[i]];
  }
};

},{}],20:[function(require,module,exports){
'use strict';

var isset = require('../isset');

module.exports = function baseCloneArray(iterable) {

  var i = iterable.length;

  var clone = Array(i--);

  for (; i >= 0; --i) {
    if (isset(i, iterable)) {
      clone[i] = iterable[i];
    }
  }

  return clone;
};

},{"../isset":57}],21:[function(require,module,exports){
'use strict';

module.exports = function (target, source) {
  for (var i = source.length - 1; i >= 0; --i) {
    target[i] = source[i];
  }
};

},{}],22:[function(require,module,exports){
'use strict';

var isset = require('../isset');

var undefined; // jshint ignore: line

var defineGetter = Object.prototype.__defineGetter__,
    defineSetter = Object.prototype.__defineSetter__;

function baseDefineProperty(object, key, descriptor) {
  var hasGetter = isset('get', descriptor),
      hasSetter = isset('set', descriptor),
      get,
      set;

  if (hasGetter || hasSetter) {
    if (hasGetter && typeof (get = descriptor.get) !== 'function') {
      throw TypeError('Getter must be a function: ' + get);
    }

    if (hasSetter && typeof (set = descriptor.set) !== 'function') {
      throw TypeError('Setter must be a function: ' + set);
    }

    if (isset('writable', descriptor)) {
      throw TypeError('Invalid property descriptor. Cannot both specify accessors and a value or writable attribute');
    }

    if (defineGetter) {
      if (hasGetter) {
        defineGetter.call(object, key, get);
      }

      if (hasSetter) {
        defineSetter.call(object, key, set);
      }
    } else {
      throw Error('Cannot define getter or setter');
    }
  } else if (isset('value', descriptor)) {
    object[key] = descriptor.value;
  } else if (!isset(key, object)) {
    object[key] = undefined;
  }

  return object;
}

module.exports = baseDefineProperty;

},{"../isset":57}],23:[function(require,module,exports){
'use strict';

module.exports = function baseExec(regexp, string) {
  var result = [],
      value;

  regexp.lastIndex = 0;

  while (value = regexp.exec(string)) {
    result.push(value);
  }

  return result;
};

},{}],24:[function(require,module,exports){
'use strict';

var callIteratee = require('../call-iteratee'),
    isset = require('../isset');

module.exports = function baseForEach(arr, fn, ctx, fromRight) {
  var i, j, idx;

  for (i = -1, j = arr.length - 1; j >= 0; --j) {
    if (fromRight) {
      idx = j;
    } else {
      idx = ++i;
    }

    if (isset(idx, arr) && callIteratee(fn, ctx, arr[idx], idx, arr) === false) {
      break;
    }
  }

  return arr;
};

},{"../call-iteratee":31,"../isset":57}],25:[function(require,module,exports){
'use strict';

var callIteratee = require('../call-iteratee');

module.exports = function baseForIn(obj, fn, ctx, fromRight, keys) {
  var i, j, key;

  for (i = -1, j = keys.length - 1; j >= 0; --j) {
    if (fromRight) {
      key = keys[j];
    } else {
      key = keys[++i];
    }

    if (callIteratee(fn, ctx, obj[key], key, obj) === false) {
      break;
    }
  }

  return obj;
};

},{"../call-iteratee":31}],26:[function(require,module,exports){
'use strict';

var isset = require('../isset');

module.exports = function baseGet(obj, path, off) {
  var l = path.length - off,
      i = 0,
      key;

  for (; i < l; ++i) {
    key = path[i];

    if (isset(key, obj)) {
      obj = obj[key];
    } else {
      return;
    }
  }

  return obj;
};

},{"../isset":57}],27:[function(require,module,exports){
'use strict';

var baseToIndex = require('./base-to-index');

var indexOf = Array.prototype.indexOf,
    lastIndexOf = Array.prototype.lastIndexOf;

function baseIndexOf(arr, search, fromIndex, fromRight) {
  var l, i, j, idx, val;

  // use the native function if it is supported and the search is not nan.

  if (search === search && (idx = fromRight ? lastIndexOf : indexOf)) {
    return idx.call(arr, search, fromIndex);
  }

  l = arr.length;

  if (!l) {
    return -1;
  }

  j = l - 1;

  if (typeof fromIndex !== 'undefined') {
    fromIndex = baseToIndex(fromIndex, l);

    if (fromRight) {
      j = Math.min(j, fromIndex);
    } else {
      j = Math.max(0, fromIndex);
    }

    i = j - 1;
  } else {
    i = -1;
  }

  for (; j >= 0; --j) {
    if (fromRight) {
      idx = j;
    } else {
      idx = ++i;
    }

    val = arr[idx];

    if (val === search || search !== search && val !== val) {
      return idx;
    }
  }

  return -1;
}

module.exports = baseIndexOf;

},{"./base-to-index":30}],28:[function(require,module,exports){
'use strict';

var baseIndexOf = require('./base-index-of');

var support = require('../support/support-keys');

var hasOwnProperty = Object.prototype.hasOwnProperty;

var k, fixKeys;

if (support === 'not-supported') {
  k = ['toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor'];

  fixKeys = function fixKeys(keys, object) {
    var i, key;

    for (i = k.length - 1; i >= 0; --i) {
      if (baseIndexOf(keys, key = k[i]) < 0 && hasOwnProperty.call(object, key)) {
        keys.push(key);
      }
    }

    return keys;
  };
}

module.exports = function baseKeys(object) {
  var keys = [];

  var key;

  for (key in object) {
    if (hasOwnProperty.call(object, key)) {
      keys.push(key);
    }
  }

  if (support !== 'not-supported') {
    return keys;
  }

  return fixKeys(keys, object);
};

},{"../support/support-keys":67,"./base-index-of":27}],29:[function(require,module,exports){
'use strict';

var get = require('./base-get');

module.exports = function baseProperty(object, path) {
  if (object != null) {
    if (path.length > 1) {
      return get(object, path, 0);
    }

    return object[path[0]];
  }
};

},{"./base-get":26}],30:[function(require,module,exports){
'use strict';

module.exports = function baseToIndex(v, l) {
  if (!l || !v) {
    return 0;
  }

  if (v < 0) {
    v += l;
  }

  return v || 0;
};

},{}],31:[function(require,module,exports){
'use strict';

module.exports = function callIteratee(fn, ctx, val, key, obj) {
  if (typeof ctx === 'undefined') {
    return fn(val, key, obj);
  }

  return fn.call(ctx, val, key, obj);
};

},{}],32:[function(require,module,exports){
'use strict';

var upperFirst = require('./upper-first');

// camelize( 'background-repeat-x' ); // -> 'backgroundRepeatX'

module.exports = function camelize(string) {

  var words = string.match(/[0-9a-z]+/gi);

  var result, i, l;

  if (!words) {
    return '';
  }

  result = words[0].toLowerCase();

  for (i = 1, l = words.length; i < l; ++i) {
    result += upperFirst(words[i]);
  }

  return result;
};

},{"./upper-first":72}],33:[function(require,module,exports){
'use strict';

var baseExec = require('./base/base-exec'),
    unescape = require('./unescape'),
    isKey = require('./is-key'),
    toKey = require('./to-key'),
    _type = require('./_type');

var rProperty = /(^|\.)\s*([_a-z]\w*)\s*|\[\s*((?:-)?(?:\d+|\d*\.\d+)|("|')(([^\\]\\(\\\\)*|[^\4])*)\4)\s*\]/gi;

function stringToPath(str) {
  var path = baseExec(rProperty, str),
      i = path.length - 1,
      val;

  for (; i >= 0; --i) {
    val = path[i];

    // .name
    if (val[2]) {
      path[i] = val[2];
      // [ "" ] || [ '' ]
    } else if (val[5] !== null) {
      path[i] = unescape(val[5]);
      // [ 0 ]
    } else {
      path[i] = val[3];
    }
  }

  return path;
}

function castPath(val) {
  var path, l, i;

  if (isKey(val)) {
    return [toKey(val)];
  }

  if (_type(val) === 'array') {
    path = Array(l = val.length);

    for (i = l - 1; i >= 0; --i) {
      path[i] = toKey(val[i]);
    }
  } else {
    path = stringToPath('' + val);
  }

  return path;
}

module.exports = castPath;

},{"./_type":17,"./base/base-exec":23,"./is-key":51,"./to-key":68,"./unescape":71}],34:[function(require,module,exports){
'use strict';

var closest = require('./closest');

module.exports = function closestNode(e, c) {
  if (typeof c === 'string') {
    return closest.call(e, c);
  }

  do {
    if (e === c) {
      return e;
    }
  } while (e = e.parentNode);

  return null;
};

},{"./closest":35}],35:[function(require,module,exports){
'use strict';

var matches = require('./matches-selector');

var closest;

if (typeof Element === 'undefined' || !(closest = Element.prototype.closest)) {
  closest = function closest(selector) {
    var element = this;

    do {
      if (matches.call(element, selector)) {
        return element;
      }
    } while (element = element.parentElement);

    return null;
  };
}

module.exports = closest;

},{"./matches-selector":61}],36:[function(require,module,exports){
'use strict';

module.exports = {
  ERR: {
    INVALID_ARGS: 'Invalid arguments',
    FUNCTION_EXPECTED: 'Expected a function',
    STRING_EXPECTED: 'Expected a string',
    UNDEFINED_OR_NULL: 'Cannot convert undefined or null to object',
    REDUCE_OF_EMPTY_ARRAY: 'Reduce of empty array with no initial value',
    NO_PATH: 'No path was given'
  },

  MAX_ARRAY_LENGTH: 4294967295,
  MAX_SAFE_INT: 9007199254740991,
  MIN_SAFE_INT: -9007199254740991,

  DEEP: 1,
  DEEP_KEEP_FN: 2
};

},{}],37:[function(require,module,exports){
'use strict';

var defineProperties = require('./define-properties');

var setPrototypeOf = require('./set-prototype-of');

var isPrimitive = require('./is-primitive');

function C() {}

module.exports = Object.create || function create(prototype, descriptors) {
  var object;

  if (prototype !== null && isPrimitive(prototype)) {
    throw TypeError('Object prototype may only be an Object or null: ' + prototype);
  }

  C.prototype = prototype;

  object = new C();

  C.prototype = null;

  if (prototype === null) {
    setPrototypeOf(object, null);
  }

  if (arguments.length >= 2) {
    defineProperties(object, descriptors);
  }

  return object;
};

},{"./define-properties":42,"./is-primitive":54,"./set-prototype-of":65}],38:[function(require,module,exports){
'use strict';

var baseForEach = require('../base/base-for-each'),
    baseForIn = require('../base/base-for-in'),
    isArrayLike = require('../is-array-like'),
    toObject = require('../to-object'),
    iteratee = require('../iteratee').iteratee,
    keys = require('../keys');

module.exports = function createEach(fromRight) {
  return function each(obj, fn, ctx) {

    obj = toObject(obj);

    fn = iteratee(fn);

    if (isArrayLike(obj)) {
      return baseForEach(obj, fn, ctx, fromRight);
    }

    return baseForIn(obj, fn, ctx, fromRight, keys(obj));
  };
};

},{"../base/base-for-each":24,"../base/base-for-in":25,"../is-array-like":48,"../iteratee":58,"../keys":59,"../to-object":69}],39:[function(require,module,exports){
'use strict';

var ERR = require('../constants').ERR;

module.exports = function createFirst(name) {
  return function (str) {
    if (str == null) {
      throw TypeError(ERR.UNDEFINED_OR_NULL);
    }

    return (str += '').charAt(0)[name]() + str.slice(1);
  };
};

},{"../constants":36}],40:[function(require,module,exports){
'use strict';

var castPath = require('../cast-path'),
    noop = require('../noop');

module.exports = function createProperty(baseProperty, useArgs) {
  return function (path) {
    var args;

    if (!(path = castPath(path)).length) {
      return noop;
    }

    if (useArgs) {
      args = Array.prototype.slice.call(arguments, 1);
    }

    return function (object) {
      return baseProperty(object, path, args);
    };
  };
};

},{"../cast-path":33,"../noop":62}],41:[function(require,module,exports){
'use strict';

module.exports = {
  'animationIterationCount': true,
  'columnCount': true,
  'fillOpacity': true,
  'flexShrink': true,
  'fontWeight': true,
  'lineHeight': true,
  'flexGrow': true,
  'opacity': true,
  'orphans': true,
  'widows': true,
  'zIndex': true,
  'order': true,
  'zoom': true
};

},{}],42:[function(require,module,exports){
'use strict';

var support = require('./support/support-define-property');

var defineProperties, baseDefineProperty, isPrimitive, each;

if (support !== 'full') {
  isPrimitive = require('./is-primitive');
  each = require('./each');
  baseDefineProperty = require('./base/base-define-property');

  defineProperties = function defineProperties(object, descriptors) {
    if (support !== 'not-supported') {
      try {
        return Object.defineProperties(object, descriptors);
      } catch (e) {}
    }

    if (isPrimitive(object)) {
      throw TypeError('defineProperties called on non-object');
    }

    if (isPrimitive(descriptors)) {
      throw TypeError('Property description must be an object: ' + descriptors);
    }

    each(descriptors, function (descriptor, key) {
      if (isPrimitive(descriptor)) {
        throw TypeError('Property description must be an object: ' + descriptor);
      }

      baseDefineProperty(this, key, descriptor);
    }, object);

    return object;
  };
} else {
  defineProperties = Object.defineProperties;
}

module.exports = defineProperties;

},{"./base/base-define-property":22,"./each":43,"./is-primitive":54,"./support/support-define-property":66}],43:[function(require,module,exports){
'use strict';

module.exports = require('./create/create-each')();

},{"./create/create-each":38}],44:[function(require,module,exports){
'use strict';

var closestNode = require('./closest-node');

var DOMWrapper = require('./DOMWrapper');

var create = require('./create');

var Event = require('./Event');

var events = {
  items: create(null),
  types: []
};

var support = typeof self !== 'undefined' && 'addEventListener' in self;

/**
 * @param {Node} element The element to which the listener should be attached.
 * @param {string} type The event type name.
 * @param {string} [selector] The selector to which delegate an event.
 * @param {function} listener The event listener.
 * @param {boolean} useCapture
 * @param {boolean} [one] Remove the listener after it first dispatching?
 */

// on( document, 'click', '.post__like-button', ( event ) => {
//   const data = {
//     id: _( this ).parent( '.post' ).attr( 'data-id' )
//   }

//   ajax( '/like', { data } )
// }, false )

exports.on = function on(element, type, selector, listener, useCapture, one) {

  var item = {
    useCapture: useCapture,
    listener: listener,
    element: element,
    one: one
  };

  if (selector) {
    item.selector = selector;
  }

  if (support) {
    item.wrapper = function wrapper(event, _element) {
      if (selector && !_element && !(_element = closestNode(event.target, selector))) {
        return;
      }

      if (one) {
        exports.off(element, type, selector, listener, useCapture);
      }

      listener.call(_element || element, new Event(event));
    };

    element.addEventListener(type, item.wrapper, useCapture);
  } else if (typeof listener === 'function') {
    item.wrapper = function wrapper(event, _element) {
      if (selector && !_element && !(_element = closestNode(event.target, selector))) {
        return;
      }

      if (type === 'DOMContentLoaded' && element.readyState !== 'complete') {
        return;
      }

      if (one) {
        exports.off(element, type, selector, listener, useCapture);
      }

      listener.call(_element || element, new Event(event, type));
    };

    element.attachEvent(item.IEType = IEType(type), item.wrapper);
  } else {
    throw TypeError('not implemented');
  }

  if (events.items[type]) {
    events.items[type].push(item);
  } else {
    events.items[type] = [item];
    events.items[type].index = events.types.length;
    events.types.push(type);
  }
};

exports.off = function off(element, type, selector, listener, useCapture) {

  var i, items, item;

  if (type == null) {
    for (i = events.types.length - 1; i >= 0; --i) {
      event.off(element, events.types[i], selector);
    }

    return;
  }

  if (!(items = events.items[type])) {
    return;
  }

  for (i = items.length - 1; i >= 0; --i) {
    item = items[i];

    if (item.element !== element || listener != null && (item.listener !== listener || item.useCapture !== useCapture || item.selector && item.selector !== selector)) {
      continue;
    }

    items.splice(i, 1);

    if (!items.length) {
      events.types.splice(items.index, 1);
      events.items[type] = null;
    }

    if (support) {
      element.removeEventListener(type, item.wrapper, item.useCapture);
    } else {
      element.detachEvent(item.IEType, item.wrapper);
    }
  }
};

exports.trigger = function trigger(element, type, data) {

  var items = events.items[type];

  var i, closest, item;

  if (!items) {
    return;
  }

  for (i = 0; i < items.length; ++i) {
    item = items[i];

    if (element) {
      closest = closestNode(element, item.selector || item.element);
    } else if (item.selector) {

      // jshint -W083

      new DOMWrapper(item.selector).each(function () {
        item.wrapper(createEventWithTarget(type, data, this), this);
      });

      // jshint +W083

      continue;
    } else {
      closest = item.element;
    }

    if (closest) {
      item.wrapper(createEventWithTarget(type, data, element || closest), closest);
    }
  }
};

exports.copy = function copy(target, source, deep) {

  var i, j, l, items, item, type;

  for (i = events.types.length - 1; i >= 0; --i) {

    if (items = events.items[type = events.types[i]]) {

      for (j = 0, l = items.length; j < l; ++j) {

        if ((item = items[j]).target === source) {
          event.on(target, type, null, item.listener, item.useCapture, item.one);
        }
      }
    }
  }

  if (!deep) {
    return;
  }

  target = target.childNodes;
  source = source.childNodes;

  for (i = target.length - 1; i >= 0; --i) {
    event.copy(target[i], source[i], true);
  }
};

function createEventWithTarget(type, data, target) {

  var e = new Event(type, data);

  e.target = target;

  return e;
}

function IEType(type) {
  if (type === 'DOMContentLoaded') {
    return 'onreadystatechange';
  }

  return 'on' + type;
}

},{"./DOMWrapper":14,"./Event":15,"./closest-node":34,"./create":37}],45:[function(require,module,exports){
'use strict';

var isObjectLike = require('./is-object-like');

var wrappers = {
  col: [2, '<table><colgroup>', '</colgroup></table>'],
  tr: [2, '<table><tbody>', '</tbody></table>'],
  defaults: [0, '', '']
};

function append(fragment, elements) {
  for (var i = 0, l = elements.length; i < l; ++i) {
    fragment.appendChild(elements[i]);
  }
}

module.exports = function fragment(elements, context) {

  var fragment = context.createDocumentFragment();

  var i, l, j, div, tag, wrapper, element;

  for (i = 0, l = elements.length; i < l; ++i) {

    element = elements[i];

    if (isObjectLike(element)) {
      if ('nodeType' in element) {
        fragment.appendChild(element);
      } else {
        append(fragment, element);
      }
    } else if (/<|&#?\w+;/.test(element)) {
      if (!div) {
        div = context.createElement('div');
      }

      tag = /<([a-z][^\s>]*)/i.exec(element);

      if (tag) {
        wrapper = wrappers[tag = tag[1]] || wrappers[tag.toLowerCase()] || wrappers.defaults;
      } else {
        wrapper = wrappers.defaults;
      }

      div.innerHTML = wrapper[1] + element + wrapper[2];

      for (j = wrapper[0]; j > 0; --j) {
        div = div.lastChild;
      }

      append(fragment, div.childNodes);
    } else {
      fragment.appendChild(context.createTextNode(element));
    }
  }

  if (div) {
    div.innerHTML = '';
  }

  return fragment;
};

},{"./is-object-like":53}],46:[function(require,module,exports){
'use strict';

module.exports = function getStyle(e, k, c) {
  return e.style[k] || (c || getComputedStyle(e)).getPropertyValue(k);
};

},{}],47:[function(require,module,exports){
'use strict';

var isObjectLike = require('./is-object-like'),
    isLength = require('./is-length'),
    isWindowLike = require('./is-window-like');

module.exports = function isArrayLikeObject(value) {
    return isObjectLike(value) && isLength(value.length) && !isWindowLike(value);
};

},{"./is-length":52,"./is-object-like":53,"./is-window-like":56}],48:[function(require,module,exports){
'use strict';

var isLength = require('./is-length'),
    isWindowLike = require('./is-window-like');

module.exports = function isArrayLike(value) {
  if (value == null) {
    return false;
  }

  if (typeof value === 'object') {
    return isLength(value.length) && !isWindowLike(value);
  }

  return typeof value === 'string';
};

},{"./is-length":52,"./is-window-like":56}],49:[function(require,module,exports){
'use strict';

var isObjectLike = require('./is-object-like'),
    isLength = require('./is-length');

var toString = {}.toString;

module.exports = Array.isArray || function isArray(value) {
    return isObjectLike(value) && isLength(value.length) && toString.call(value) === '[object Array]';
};

},{"./is-length":52,"./is-object-like":53}],50:[function(require,module,exports){
'use strict';

var isObjectLike = require('./is-object-like'),
    isWindowLike = require('./is-window-like');

module.exports = function isDOMElement(value) {
  var nodeType;

  if (!isObjectLike(value)) {
    return false;
  }

  if (isWindowLike(value)) {
    return true;
  }

  nodeType = value.nodeType;

  return nodeType === 1 || // ELEMENT_NODE
  nodeType === 3 || // TEXT_NODE
  nodeType === 8 || // COMMENT_NODE
  nodeType === 9 || // DOCUMENT_NODE
  nodeType === 11; // DOCUMENT_FRAGMENT_NODE
};

},{"./is-object-like":53,"./is-window-like":56}],51:[function(require,module,exports){
'use strict';

var _type = require('./_type');

var rDeepKey = /(^|[^\\])(\\\\)*(\.|\[)/;

function isKey(val) {
  var type;

  if (!val) {
    return true;
  }

  if (_type(val) === 'array') {
    return false;
  }

  type = typeof val;

  if (type === 'number' || type === 'boolean' || _type(val) === 'symbol') {
    return true;
  }

  return !rDeepKey.test(val);
}

module.exports = isKey;

},{"./_type":17}],52:[function(require,module,exports){
'use strict';

var MAX_ARRAY_LENGTH = require('./constants').MAX_ARRAY_LENGTH;

module.exports = function isLength(value) {
  return typeof value === 'number' && value >= 0 && value <= MAX_ARRAY_LENGTH && value % 1 === 0;
};

},{"./constants":36}],53:[function(require,module,exports){
'use strict';

module.exports = function isObjectLike(value) {
  return !!value && typeof value === 'object';
};

},{}],54:[function(require,module,exports){
'use strict';

module.exports = function isPrimitive(value) {
  return !value || typeof value !== 'object' && typeof value !== 'function';
};

},{}],55:[function(require,module,exports){
'use strict';

var type = require('./type');

module.exports = function isSymbol(value) {
  return type(value) === 'symbol';
};

},{"./type":70}],56:[function(require,module,exports){
'use strict';

var isObjectLike = require('./is-object-like');

module.exports = function isWindowLike(value) {
  return isObjectLike(value) && value.window === value;
};

},{"./is-object-like":53}],57:[function(require,module,exports){
'use strict';

module.exports = function isset(key, obj) {
  if (obj == null) {
    return false;
  }

  return typeof obj[key] !== 'undefined' || key in obj;
};

},{}],58:[function(require,module,exports){
'use strict';

var isArrayLikeObject = require('./is-array-like-object'),
    matchesProperty = require('./matches-property'),
    property = require('./property');

exports.iteratee = function iteratee(value) {
  if (typeof value === 'function') {
    return value;
  }

  if (isArrayLikeObject(value)) {
    return matchesProperty(value);
  }

  return property(value);
};

},{"./is-array-like-object":47,"./matches-property":60,"./property":64}],59:[function(require,module,exports){
'use strict';

var baseKeys = require('./base/base-keys');

var toObject = require('./to-object');

var support = require('./support/support-keys');

var keys;

if (support !== 'es2015') {
  keys = function keys(v) {
    return baseKeys(toObject(v));
  };
} else {
  keys = Object.keys;
}

module.exports = keys;

},{"./base/base-keys":28,"./support/support-keys":67,"./to-object":69}],60:[function(require,module,exports){
'use strict';

var castPath = require('./cast-path'),
    get = require('./base/base-get'),
    ERR = require('./constants').ERR;

module.exports = function matchesProperty(property) {

  var path = castPath(property[0]),
      value = property[1];

  if (!path.length) {
    throw Error(ERR.NO_PATH);
  }

  return function (object) {

    if (object == null) {
      return false;
    }

    if (path.length > 1) {
      return get(object, path, 0) === value;
    }

    return object[path[0]] === value;
  };
};

},{"./base/base-get":26,"./cast-path":33,"./constants":36}],61:[function(require,module,exports){
'use strict';

var baseIndexOf = require('./base/base-index-of');

var matches;

if (typeof Element === 'undefined' || !(matches = Element.prototype.matches || Element.prototype.oMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.webkitMatchesSelector)) {
  matches = function matches(selector) {
    if (/^#[\w\-]+$/.test(selector += '')) {
      return '#' + this.id === selector;
    }

    return baseIndexOf(this.ownerDocument.querySelectorAll(selector), this) >= 0;
  };
}

module.exports = matches;

},{"./base/base-index-of":27}],62:[function(require,module,exports){
'use strict';

module.exports = function noop() {};

},{}],63:[function(require,module,exports){
'use strict';

var baseCloneArray = require('./base/base-clone-array'),
    fragment = require('./fragment');

module.exports = function parseHTML(data, ctx) {
  var match = /^(?:<([\w-]+)><\/[\w-]+>|<([\w-]+)(?:\s*\/)?>)$/.exec(data);

  if (match) {
    return [document.createElement(match[1] || match[2])];
  }

  return baseCloneArray(fragment([data], ctx || document).childNodes);
};

},{"./base/base-clone-array":20,"./fragment":45}],64:[function(require,module,exports){
'use strict';

module.exports = require('./create/create-property')(require('./base/base-property'));

},{"./base/base-property":29,"./create/create-property":40}],65:[function(require,module,exports){
'use strict';

var isPrimitive = require('./is-primitive'),
    ERR = require('./constants').ERR;

module.exports = Object.setPrototypeOf || function setPrototypeOf(target, prototype) {
  if (target == null) {
    throw TypeError(ERR.UNDEFINED_OR_NULL);
  }

  if (prototype !== null && isPrimitive(prototype)) {
    throw TypeError('Object prototype may only be an Object or null: ' + prototype);
  }

  if ('__proto__' in target) {
    target.__proto__ = prototype; // jshint ignore: line
  }

  return target;
};

},{"./constants":36,"./is-primitive":54}],66:[function(require,module,exports){
'use strict';

var support;

function test(target) {
  try {
    if ('' in Object.defineProperty(target, '', {})) {
      return true;
    }
  } catch (e) {}

  return false;
}

if (test({})) {
  support = 'full';
} else if (typeof document !== 'undefined' && test(document.createElement('span'))) {
  support = 'dom';
} else {
  support = 'not-supported';
}

module.exports = support;

},{}],67:[function(require,module,exports){
'use strict';

var support;

if (Object.keys) {
  try {
    support = Object.keys(''), 'es2015'; // jshint ignore: line
  } catch (e) {
    support = 'es5';
  }
} else if ({ toString: null }.propertyIsEnumerable('toString')) {
  support = 'not-supported';
} else {
  support = 'has-a-bug';
}

module.exports = support;

},{}],68:[function(require,module,exports){
'use strict';

var unescape = require('./unescape'),
    isSymbol = require('./is-symbol');

module.exports = function toKey(val) {
  var key;

  if (typeof val === 'string') {
    return unescape(val);
  }

  if (isSymbol(val)) {
    return val;
  }

  key = '' + val;

  if (key === '0' && 1 / val === -Infinity) {
    return '-0';
  }

  return unescape(key);
};

},{"./is-symbol":55,"./unescape":71}],69:[function(require,module,exports){
'use strict';

var ERR = require('./constants').ERR;

module.exports = function toObject(value) {
  if (value == null) {
    throw TypeError(ERR.UNDEFINED_OR_NULL);
  }

  return Object(value);
};

},{"./constants":36}],70:[function(require,module,exports){
'use strict';

var create = require('./create');

var toString = {}.toString,
    types = create(null);

module.exports = function getType(value) {
  var type, tag;

  if (value === null) {
    return 'null';
  }

  type = typeof value;

  if (type !== 'object' && type !== 'function') {
    return type;
  }

  type = types[tag = toString.call(value)];

  if (type) {
    return type;
  }

  return types[tag] = tag.slice(8, -1).toLowerCase();
};

},{"./create":37}],71:[function(require,module,exports){
'use strict';

module.exports = function unescape(string) {
  return string.replace(/\\(\\)?/g, '$1');
};

},{}],72:[function(require,module,exports){
'use strict';

module.exports = require('./create/create-first')('toUpperCase');

},{"./create/create-first":39}],73:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @license
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Copyright 2016 Google Inc.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Licensed under the Apache License, Version 2.0 (the "License");
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * you may not use this file except in compliance with the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * You may obtain a copy of the License at
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *   http://www.apache.org/licenses/LICENSE-2.0
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Unless required by applicable law or agreed to in writing, software
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * distributed under the License is distributed on an "AS IS" BASIS,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * See the License for the specific language governing permissions and
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * limitations under the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _foundation = require('./foundation');

var _foundation2 = _interopRequireDefault(_foundation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @template F
 */
var MDCComponent = function () {
  _createClass(MDCComponent, null, [{
    key: 'attachTo',

    /**
     * @param {!Element} root
     * @return {!MDCComponent}
     */
    value: function attachTo(root) {
      // Subclasses which extend MDCBase should provide an attachTo() method that takes a root element and
      // returns an instantiated component with its root set to that element. Also note that in the cases of
      // subclasses, an explicit foundation class will not have to be passed in; it will simply be initialized
      // from getDefaultFoundation().
      return new MDCComponent(root, new _foundation2.default());
    }

    /**
     * @param {!Element} root
     * @param {F=} foundation
     * @param {...?} args
     */

  }]);

  function MDCComponent(root) {
    var foundation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

    _classCallCheck(this, MDCComponent);

    /** @protected {!Element} */
    this.root_ = root;

    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    this.initialize.apply(this, args);
    // Note that we initialize foundation here and not within the constructor's default param so that
    // this.root_ is defined and can be used within the foundation class.
    /** @protected {!F} */
    this.foundation_ = foundation === undefined ? this.getDefaultFoundation() : foundation;
    this.foundation_.init();
    this.initialSyncWithDOM();
  }

  _createClass(MDCComponent, [{
    key: 'initialize',
    value: function initialize() /* ...args */{}
    // Subclasses can override this to do any additional setup work that would be considered part of a
    // "constructor". Essentially, it is a hook into the parent constructor before the foundation is
    // initialized. Any additional arguments besides root and foundation will be passed in here.


    /**
     * @return {!F} foundation
     */

  }, {
    key: 'getDefaultFoundation',
    value: function getDefaultFoundation() {
      // Subclasses must override this method to return a properly configured foundation class for the
      // component.
      throw new Error('Subclasses must override getDefaultFoundation to return a properly configured ' + 'foundation class');
    }
  }, {
    key: 'initialSyncWithDOM',
    value: function initialSyncWithDOM() {
      // Subclasses should override this method if they need to perform work to synchronize with a host DOM
      // object. An example of this would be a form control wrapper that needs to synchronize its internal state
      // to some property or attribute of the host DOM. Please note: this is *not* the place to perform DOM
      // reads/writes that would cause layout / paint, as this is called synchronously from within the constructor.
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      // Subclasses may implement this method to release any resources / deregister any listeners they have
      // attached. An example of this might be deregistering a resize event from the window object.
      this.foundation_.destroy();
    }

    /**
     * Wrapper method to add an event listener to the component's root element. This is most useful when
     * listening for custom events.
     * @param {string} evtType
     * @param {!Function} handler
     */

  }, {
    key: 'listen',
    value: function listen(evtType, handler) {
      this.root_.addEventListener(evtType, handler);
    }

    /**
     * Wrapper method to remove an event listener to the component's root element. This is most useful when
     * unlistening for custom events.
     * @param {string} evtType
     * @param {!Function} handler
     */

  }, {
    key: 'unlisten',
    value: function unlisten(evtType, handler) {
      this.root_.removeEventListener(evtType, handler);
    }

    /**
     * Fires a cross-browser-compatible custom event from the component root of the given type,
     * with the given data.
     * @param {string} evtType
     * @param {!Object} evtData
     * @param {boolean=} shouldBubble
     */

  }, {
    key: 'emit',
    value: function emit(evtType, evtData) {
      var shouldBubble = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      var evt = void 0;
      if (typeof CustomEvent === 'function') {
        evt = new CustomEvent(evtType, {
          detail: evtData,
          bubbles: shouldBubble
        });
      } else {
        evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(evtType, shouldBubble, false, evtData);
      }

      this.root_.dispatchEvent(evt);
    }
  }]);

  return MDCComponent;
}();

exports.default = MDCComponent;

},{"./foundation":74}],74:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @template A
 */
var MDCFoundation = function () {
  _createClass(MDCFoundation, null, [{
    key: "cssClasses",

    /** @return enum{cssClasses} */
    get: function get() {
      // Classes extending MDCFoundation should implement this method to return an object which exports every
      // CSS class the foundation class needs as a property. e.g. {ACTIVE: 'mdc-component--active'}
      return {};
    }

    /** @return enum{strings} */

  }, {
    key: "strings",
    get: function get() {
      // Classes extending MDCFoundation should implement this method to return an object which exports all
      // semantic strings as constants. e.g. {ARIA_ROLE: 'tablist'}
      return {};
    }

    /** @return enum{numbers} */

  }, {
    key: "numbers",
    get: function get() {
      // Classes extending MDCFoundation should implement this method to return an object which exports all
      // of its semantic numbers as constants. e.g. {ANIMATION_DELAY_MS: 350}
      return {};
    }

    /** @return {!Object} */

  }, {
    key: "defaultAdapter",
    get: function get() {
      // Classes extending MDCFoundation may choose to implement this getter in order to provide a convenient
      // way of viewing the necessary methods of an adapter. In the future, this could also be used for adapter
      // validation.
      return {};
    }

    /**
     * @param {A=} adapter
     */

  }]);

  function MDCFoundation() {
    var adapter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, MDCFoundation);

    /** @protected {!A} */
    this.adapter_ = adapter;
  }

  _createClass(MDCFoundation, [{
    key: "init",
    value: function init() {
      // Subclasses should override this method to perform initialization routines (registering events, etc.)
    }
  }, {
    key: "destroy",
    value: function destroy() {
      // Subclasses should override this method to perform de-initialization routines (de-registering events, etc.)
    }
  }]);

  return MDCFoundation;
}();

exports.default = MDCFoundation;

},{}],75:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @license
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* eslint no-unused-vars: [2, {"args": "none"}] */

/**
 * Adapter for MDC Ripple. Provides an interface for managing
 * - classes
 * - dom
 * - CSS variables
 * - position
 * - dimensions
 * - scroll position
 * - event handlers
 * - unbounded, active and disabled states
 *
 * Additionally, provides type information for the adapter to the Closure
 * compiler.
 *
 * Implement this adapter for your framework of choice to delegate updates to
 * the component in your framework of choice. See architecture documentation
 * for more details.
 * https://github.com/material-components/material-components-web/blob/master/docs/code/architecture.md
 *
 * @record
 */
var MDCRippleAdapter = function () {
  function MDCRippleAdapter() {
    _classCallCheck(this, MDCRippleAdapter);
  }

  _createClass(MDCRippleAdapter, [{
    key: "browserSupportsCssVars",

    /** @return {boolean} */
    value: function browserSupportsCssVars() {}

    /** @return {boolean} */

  }, {
    key: "isUnbounded",
    value: function isUnbounded() {}

    /** @return {boolean} */

  }, {
    key: "isSurfaceActive",
    value: function isSurfaceActive() {}

    /** @return {boolean} */

  }, {
    key: "isSurfaceDisabled",
    value: function isSurfaceDisabled() {}

    /** @param {string} className */

  }, {
    key: "addClass",
    value: function addClass(className) {}

    /** @param {string} className */

  }, {
    key: "removeClass",
    value: function removeClass(className) {}

    /** @param {!EventTarget} target */

  }, {
    key: "containsEventTarget",
    value: function containsEventTarget(target) {}

    /**
     * @param {string} evtType
     * @param {!Function} handler
     */

  }, {
    key: "registerInteractionHandler",
    value: function registerInteractionHandler(evtType, handler) {}

    /**
     * @param {string} evtType
     * @param {!Function} handler
     */

  }, {
    key: "deregisterInteractionHandler",
    value: function deregisterInteractionHandler(evtType, handler) {}

    /**
     * @param {string} evtType
     * @param {!Function} handler
     */

  }, {
    key: "registerDocumentInteractionHandler",
    value: function registerDocumentInteractionHandler(evtType, handler) {}

    /**
     * @param {string} evtType
     * @param {!Function} handler
     */

  }, {
    key: "deregisterDocumentInteractionHandler",
    value: function deregisterDocumentInteractionHandler(evtType, handler) {}

    /**
     * @param {!Function} handler
     */

  }, {
    key: "registerResizeHandler",
    value: function registerResizeHandler(handler) {}

    /**
     * @param {!Function} handler
     */

  }, {
    key: "deregisterResizeHandler",
    value: function deregisterResizeHandler(handler) {}

    /**
     * @param {string} varName
     * @param {?number|string} value
     */

  }, {
    key: "updateCssVariable",
    value: function updateCssVariable(varName, value) {}

    /** @return {!ClientRect} */

  }, {
    key: "computeBoundingRect",
    value: function computeBoundingRect() {}

    /** @return {{x: number, y: number}} */

  }, {
    key: "getWindowPageOffset",
    value: function getWindowPageOffset() {}
  }]);

  return MDCRippleAdapter;
}();

exports.default = MDCRippleAdapter;

},{}],76:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * @license
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var cssClasses = {
  // Ripple is a special case where the "root" component is really a "mixin" of sorts,
  // given that it's an 'upgrade' to an existing component. That being said it is the root
  // CSS class that all other CSS classes derive from.
  ROOT: 'mdc-ripple-upgraded',
  UNBOUNDED: 'mdc-ripple-upgraded--unbounded',
  BG_FOCUSED: 'mdc-ripple-upgraded--background-focused',
  FG_ACTIVATION: 'mdc-ripple-upgraded--foreground-activation',
  FG_DEACTIVATION: 'mdc-ripple-upgraded--foreground-deactivation'
};

var strings = {
  VAR_LEFT: '--mdc-ripple-left',
  VAR_TOP: '--mdc-ripple-top',
  VAR_FG_SIZE: '--mdc-ripple-fg-size',
  VAR_FG_SCALE: '--mdc-ripple-fg-scale',
  VAR_FG_TRANSLATE_START: '--mdc-ripple-fg-translate-start',
  VAR_FG_TRANSLATE_END: '--mdc-ripple-fg-translate-end'
};

var numbers = {
  PADDING: 10,
  INITIAL_ORIGIN_SCALE: 0.6,
  DEACTIVATION_TIMEOUT_MS: 225, // Corresponds to $mdc-ripple-translate-duration (i.e. activation animation duration)
  FG_DEACTIVATION_MS: 150, // Corresponds to $mdc-ripple-fade-out-duration (i.e. deactivation animation duration)
  TAP_DELAY_MS: 300 // Delay between touch and simulated mouse events on touch devices
};

exports.cssClasses = cssClasses;
exports.strings = strings;
exports.numbers = numbers;

},{}],77:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _foundation = require('@material/base/foundation');

var _foundation2 = _interopRequireDefault(_foundation);

var _adapter = require('./adapter');

var _adapter2 = _interopRequireDefault(_adapter);

var _constants = require('./constants');

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @license
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Copyright 2016 Google Inc. All Rights Reserved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Licensed under the Apache License, Version 2.0 (the "License");
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * you may not use this file except in compliance with the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * You may obtain a copy of the License at
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *      http://www.apache.org/licenses/LICENSE-2.0
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Unless required by applicable law or agreed to in writing, software
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * distributed under the License is distributed on an "AS IS" BASIS,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * See the License for the specific language governing permissions and
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * limitations under the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

/**
 * @typedef {{
 *   isActivated: (boolean|undefined),
 *   hasDeactivationUXRun: (boolean|undefined),
 *   wasActivatedByPointer: (boolean|undefined),
 *   wasElementMadeActive: (boolean|undefined),
 *   activationEvent: Event,
 *   isProgrammatic: (boolean|undefined)
 * }}
 */
var ActivationStateType = void 0;

/**
 * @typedef {{
 *   activate: (string|undefined),
 *   deactivate: (string|undefined),
 *   focus: (string|undefined),
 *   blur: (string|undefined)
 * }}
 */
var ListenerInfoType = void 0;

/**
 * @typedef {{
 *   activate: function(!Event),
 *   deactivate: function(!Event),
 *   focus: function(),
 *   blur: function()
 * }}
 */
var ListenersType = void 0;

/**
 * @typedef {{
 *   x: number,
 *   y: number
 * }}
 */
var PointType = void 0;

// Activation events registered on the root element of each instance for activation
var ACTIVATION_EVENT_TYPES = ['touchstart', 'pointerdown', 'mousedown', 'keydown'];

// Deactivation events registered on documentElement when a pointer-related down event occurs
var POINTER_DEACTIVATION_EVENT_TYPES = ['touchend', 'pointerup', 'mouseup'];

// Tracks activations that have occurred on the current frame, to avoid simultaneous nested activations
/** @type {!Array<!EventTarget>} */
var activatedTargets = [];

/**
 * @extends {MDCFoundation<!MDCRippleAdapter>}
 */

var MDCRippleFoundation = function (_MDCFoundation) {
  _inherits(MDCRippleFoundation, _MDCFoundation);

  _createClass(MDCRippleFoundation, null, [{
    key: 'cssClasses',
    get: function get() {
      return _constants.cssClasses;
    }
  }, {
    key: 'strings',
    get: function get() {
      return _constants.strings;
    }
  }, {
    key: 'numbers',
    get: function get() {
      return _constants.numbers;
    }
  }, {
    key: 'defaultAdapter',
    get: function get() {
      return {
        browserSupportsCssVars: function browserSupportsCssVars() /* boolean - cached */{},
        isUnbounded: function isUnbounded() /* boolean */{},
        isSurfaceActive: function isSurfaceActive() /* boolean */{},
        isSurfaceDisabled: function isSurfaceDisabled() /* boolean */{},
        addClass: function addClass() /* className: string */{},
        removeClass: function removeClass() /* className: string */{},
        containsEventTarget: function containsEventTarget() /* target: !EventTarget */{},
        registerInteractionHandler: function registerInteractionHandler() /* evtType: string, handler: EventListener */{},
        deregisterInteractionHandler: function deregisterInteractionHandler() /* evtType: string, handler: EventListener */{},
        registerDocumentInteractionHandler: function registerDocumentInteractionHandler() /* evtType: string, handler: EventListener */{},
        deregisterDocumentInteractionHandler: function deregisterDocumentInteractionHandler() /* evtType: string, handler: EventListener */{},
        registerResizeHandler: function registerResizeHandler() /* handler: EventListener */{},
        deregisterResizeHandler: function deregisterResizeHandler() /* handler: EventListener */{},
        updateCssVariable: function updateCssVariable() /* varName: string, value: string */{},
        computeBoundingRect: function computeBoundingRect() /* ClientRect */{},
        getWindowPageOffset: function getWindowPageOffset() /* {x: number, y: number} */{}
      };
    }
  }]);

  function MDCRippleFoundation(adapter) {
    _classCallCheck(this, MDCRippleFoundation);

    /** @private {number} */
    var _this = _possibleConstructorReturn(this, (MDCRippleFoundation.__proto__ || Object.getPrototypeOf(MDCRippleFoundation)).call(this, Object.assign(MDCRippleFoundation.defaultAdapter, adapter)));

    _this.layoutFrame_ = 0;

    /** @private {!ClientRect} */
    _this.frame_ = /** @type {!ClientRect} */{ width: 0, height: 0 };

    /** @private {!ActivationStateType} */
    _this.activationState_ = _this.defaultActivationState_();

    /** @private {number} */
    _this.initialSize_ = 0;

    /** @private {number} */
    _this.maxRadius_ = 0;

    /** @private {function(!Event)} */
    _this.activateHandler_ = function (e) {
      return _this.activate_(e);
    };

    /** @private {function(!Event)} */
    _this.deactivateHandler_ = function (e) {
      return _this.deactivate_(e);
    };

    /** @private {function(?Event=)} */
    _this.focusHandler_ = function () {
      return _this.handleFocus();
    };

    /** @private {function(?Event=)} */
    _this.blurHandler_ = function () {
      return _this.handleBlur();
    };

    /** @private {!Function} */
    _this.resizeHandler_ = function () {
      return _this.layout();
    };

    /** @private {{left: number, top:number}} */
    _this.unboundedCoords_ = {
      left: 0,
      top: 0
    };

    /** @private {number} */
    _this.fgScale_ = 0;

    /** @private {number} */
    _this.activationTimer_ = 0;

    /** @private {number} */
    _this.fgDeactivationRemovalTimer_ = 0;

    /** @private {boolean} */
    _this.activationAnimationHasEnded_ = false;

    /** @private {!Function} */
    _this.activationTimerCallback_ = function () {
      _this.activationAnimationHasEnded_ = true;
      _this.runDeactivationUXLogicIfReady_();
    };

    /** @private {?Event} */
    _this.previousActivationEvent_ = null;
    return _this;
  }

  /**
   * We compute this property so that we are not querying information about the client
   * until the point in time where the foundation requests it. This prevents scenarios where
   * client-side feature-detection may happen too early, such as when components are rendered on the server
   * and then initialized at mount time on the client.
   * @return {boolean}
   * @private
   */


  _createClass(MDCRippleFoundation, [{
    key: 'isSupported_',
    value: function isSupported_() {
      return this.adapter_.browserSupportsCssVars();
    }

    /**
     * @return {!ActivationStateType}
     */

  }, {
    key: 'defaultActivationState_',
    value: function defaultActivationState_() {
      return {
        isActivated: false,
        hasDeactivationUXRun: false,
        wasActivatedByPointer: false,
        wasElementMadeActive: false,
        activationEvent: null,
        isProgrammatic: false
      };
    }

    /** @override */

  }, {
    key: 'init',
    value: function init() {
      var _this2 = this;

      if (!this.isSupported_()) {
        return;
      }
      this.registerRootHandlers_();

      var _MDCRippleFoundation$ = MDCRippleFoundation.cssClasses,
          ROOT = _MDCRippleFoundation$.ROOT,
          UNBOUNDED = _MDCRippleFoundation$.UNBOUNDED;

      requestAnimationFrame(function () {
        _this2.adapter_.addClass(ROOT);
        if (_this2.adapter_.isUnbounded()) {
          _this2.adapter_.addClass(UNBOUNDED);
          // Unbounded ripples need layout logic applied immediately to set coordinates for both shade and ripple
          _this2.layoutInternal_();
        }
      });
    }

    /** @override */

  }, {
    key: 'destroy',
    value: function destroy() {
      var _this3 = this;

      if (!this.isSupported_()) {
        return;
      }

      if (this.activationTimer_) {
        clearTimeout(this.activationTimer_);
        this.activationTimer_ = 0;
        var FG_ACTIVATION = MDCRippleFoundation.cssClasses.FG_ACTIVATION;

        this.adapter_.removeClass(FG_ACTIVATION);
      }

      this.deregisterRootHandlers_();
      this.deregisterDeactivationHandlers_();

      var _MDCRippleFoundation$2 = MDCRippleFoundation.cssClasses,
          ROOT = _MDCRippleFoundation$2.ROOT,
          UNBOUNDED = _MDCRippleFoundation$2.UNBOUNDED;

      requestAnimationFrame(function () {
        _this3.adapter_.removeClass(ROOT);
        _this3.adapter_.removeClass(UNBOUNDED);
        _this3.removeCssVars_();
      });
    }

    /** @private */

  }, {
    key: 'registerRootHandlers_',
    value: function registerRootHandlers_() {
      var _this4 = this;

      ACTIVATION_EVENT_TYPES.forEach(function (type) {
        _this4.adapter_.registerInteractionHandler(type, _this4.activateHandler_);
      });
      this.adapter_.registerInteractionHandler('focus', this.focusHandler_);
      this.adapter_.registerInteractionHandler('blur', this.blurHandler_);

      if (this.adapter_.isUnbounded()) {
        this.adapter_.registerResizeHandler(this.resizeHandler_);
      }
    }

    /**
     * @param {!Event} e
     * @private
     */

  }, {
    key: 'registerDeactivationHandlers_',
    value: function registerDeactivationHandlers_(e) {
      var _this5 = this;

      if (e.type === 'keydown') {
        this.adapter_.registerInteractionHandler('keyup', this.deactivateHandler_);
      } else {
        POINTER_DEACTIVATION_EVENT_TYPES.forEach(function (type) {
          _this5.adapter_.registerDocumentInteractionHandler(type, _this5.deactivateHandler_);
        });
      }
    }

    /** @private */

  }, {
    key: 'deregisterRootHandlers_',
    value: function deregisterRootHandlers_() {
      var _this6 = this;

      ACTIVATION_EVENT_TYPES.forEach(function (type) {
        _this6.adapter_.deregisterInteractionHandler(type, _this6.activateHandler_);
      });
      this.adapter_.deregisterInteractionHandler('focus', this.focusHandler_);
      this.adapter_.deregisterInteractionHandler('blur', this.blurHandler_);

      if (this.adapter_.isUnbounded()) {
        this.adapter_.deregisterResizeHandler(this.resizeHandler_);
      }
    }

    /** @private */

  }, {
    key: 'deregisterDeactivationHandlers_',
    value: function deregisterDeactivationHandlers_() {
      var _this7 = this;

      this.adapter_.deregisterInteractionHandler('keyup', this.deactivateHandler_);
      POINTER_DEACTIVATION_EVENT_TYPES.forEach(function (type) {
        _this7.adapter_.deregisterDocumentInteractionHandler(type, _this7.deactivateHandler_);
      });
    }

    /** @private */

  }, {
    key: 'removeCssVars_',
    value: function removeCssVars_() {
      var _this8 = this;

      var strings = MDCRippleFoundation.strings;

      Object.keys(strings).forEach(function (k) {
        if (k.indexOf('VAR_') === 0) {
          _this8.adapter_.updateCssVariable(strings[k], null);
        }
      });
    }

    /**
     * @param {?Event} e
     * @private
     */

  }, {
    key: 'activate_',
    value: function activate_(e) {
      var _this9 = this;

      if (this.adapter_.isSurfaceDisabled()) {
        return;
      }

      var activationState = this.activationState_;
      if (activationState.isActivated) {
        return;
      }

      // Avoid reacting to follow-on events fired by touch device after an already-processed user interaction
      var previousActivationEvent = this.previousActivationEvent_;
      var isSameInteraction = previousActivationEvent && e && previousActivationEvent.type !== e.type;
      if (isSameInteraction) {
        return;
      }

      activationState.isActivated = true;
      activationState.isProgrammatic = e === null;
      activationState.activationEvent = e;
      activationState.wasActivatedByPointer = activationState.isProgrammatic ? false : e.type === 'mousedown' || e.type === 'touchstart' || e.type === 'pointerdown';

      var hasActivatedChild = e && activatedTargets.length > 0 && activatedTargets.some(function (target) {
        return _this9.adapter_.containsEventTarget(target);
      });
      if (hasActivatedChild) {
        // Immediately reset activation state, while preserving logic that prevents touch follow-on events
        this.resetActivationState_();
        return;
      }

      if (e) {
        activatedTargets.push( /** @type {!EventTarget} */e.target);
        this.registerDeactivationHandlers_(e);
      }

      activationState.wasElementMadeActive = this.checkElementMadeActive_(e);
      if (activationState.wasElementMadeActive) {
        this.animateActivation_();
      }

      requestAnimationFrame(function () {
        // Reset array on next frame after the current event has had a chance to bubble to prevent ancestor ripples
        activatedTargets = [];

        if (!activationState.wasElementMadeActive && (e.key === ' ' || e.keyCode === 32)) {
          // If space was pressed, try again within an rAF call to detect :active, because different UAs report
          // active states inconsistently when they're called within event handling code:
          // - https://bugs.chromium.org/p/chromium/issues/detail?id=635971
          // - https://bugzilla.mozilla.org/show_bug.cgi?id=1293741
          // We try first outside rAF to support Edge, which does not exhibit this problem, but will crash if a CSS
          // variable is set within a rAF callback for a submit button interaction (#2241).
          activationState.wasElementMadeActive = _this9.checkElementMadeActive_(e);
          if (activationState.wasElementMadeActive) {
            _this9.animateActivation_();
          }
        }

        if (!activationState.wasElementMadeActive) {
          // Reset activation state immediately if element was not made active.
          _this9.activationState_ = _this9.defaultActivationState_();
        }
      });
    }

    /**
     * @param {?Event} e
     * @private
     */

  }, {
    key: 'checkElementMadeActive_',
    value: function checkElementMadeActive_(e) {
      return e && e.type === 'keydown' ? this.adapter_.isSurfaceActive() : true;
    }

    /**
     * @param {?Event=} event Optional event containing position information.
     */

  }, {
    key: 'activate',
    value: function activate() {
      var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      this.activate_(event);
    }

    /** @private */

  }, {
    key: 'animateActivation_',
    value: function animateActivation_() {
      var _this10 = this;

      var _MDCRippleFoundation$3 = MDCRippleFoundation.strings,
          VAR_FG_TRANSLATE_START = _MDCRippleFoundation$3.VAR_FG_TRANSLATE_START,
          VAR_FG_TRANSLATE_END = _MDCRippleFoundation$3.VAR_FG_TRANSLATE_END;
      var _MDCRippleFoundation$4 = MDCRippleFoundation.cssClasses,
          FG_DEACTIVATION = _MDCRippleFoundation$4.FG_DEACTIVATION,
          FG_ACTIVATION = _MDCRippleFoundation$4.FG_ACTIVATION;
      var DEACTIVATION_TIMEOUT_MS = MDCRippleFoundation.numbers.DEACTIVATION_TIMEOUT_MS;


      this.layoutInternal_();

      var translateStart = '';
      var translateEnd = '';

      if (!this.adapter_.isUnbounded()) {
        var _getFgTranslationCoor = this.getFgTranslationCoordinates_(),
            startPoint = _getFgTranslationCoor.startPoint,
            endPoint = _getFgTranslationCoor.endPoint;

        translateStart = startPoint.x + 'px, ' + startPoint.y + 'px';
        translateEnd = endPoint.x + 'px, ' + endPoint.y + 'px';
      }

      this.adapter_.updateCssVariable(VAR_FG_TRANSLATE_START, translateStart);
      this.adapter_.updateCssVariable(VAR_FG_TRANSLATE_END, translateEnd);
      // Cancel any ongoing activation/deactivation animations
      clearTimeout(this.activationTimer_);
      clearTimeout(this.fgDeactivationRemovalTimer_);
      this.rmBoundedActivationClasses_();
      this.adapter_.removeClass(FG_DEACTIVATION);

      // Force layout in order to re-trigger the animation.
      this.adapter_.computeBoundingRect();
      this.adapter_.addClass(FG_ACTIVATION);
      this.activationTimer_ = setTimeout(function () {
        return _this10.activationTimerCallback_();
      }, DEACTIVATION_TIMEOUT_MS);
    }

    /**
     * @private
     * @return {{startPoint: PointType, endPoint: PointType}}
     */

  }, {
    key: 'getFgTranslationCoordinates_',
    value: function getFgTranslationCoordinates_() {
      var _activationState_ = this.activationState_,
          activationEvent = _activationState_.activationEvent,
          wasActivatedByPointer = _activationState_.wasActivatedByPointer;


      var startPoint = void 0;
      if (wasActivatedByPointer) {
        startPoint = (0, _util.getNormalizedEventCoords)(
        /** @type {!Event} */activationEvent, this.adapter_.getWindowPageOffset(), this.adapter_.computeBoundingRect());
      } else {
        startPoint = {
          x: this.frame_.width / 2,
          y: this.frame_.height / 2
        };
      }
      // Center the element around the start point.
      startPoint = {
        x: startPoint.x - this.initialSize_ / 2,
        y: startPoint.y - this.initialSize_ / 2
      };

      var endPoint = {
        x: this.frame_.width / 2 - this.initialSize_ / 2,
        y: this.frame_.height / 2 - this.initialSize_ / 2
      };

      return { startPoint: startPoint, endPoint: endPoint };
    }

    /** @private */

  }, {
    key: 'runDeactivationUXLogicIfReady_',
    value: function runDeactivationUXLogicIfReady_() {
      var _this11 = this;

      // This method is called both when a pointing device is released, and when the activation animation ends.
      // The deactivation animation should only run after both of those occur.
      var FG_DEACTIVATION = MDCRippleFoundation.cssClasses.FG_DEACTIVATION;
      var _activationState_2 = this.activationState_,
          hasDeactivationUXRun = _activationState_2.hasDeactivationUXRun,
          isActivated = _activationState_2.isActivated;

      var activationHasEnded = hasDeactivationUXRun || !isActivated;

      if (activationHasEnded && this.activationAnimationHasEnded_) {
        this.rmBoundedActivationClasses_();
        this.adapter_.addClass(FG_DEACTIVATION);
        this.fgDeactivationRemovalTimer_ = setTimeout(function () {
          _this11.adapter_.removeClass(FG_DEACTIVATION);
        }, _constants.numbers.FG_DEACTIVATION_MS);
      }
    }

    /** @private */

  }, {
    key: 'rmBoundedActivationClasses_',
    value: function rmBoundedActivationClasses_() {
      var FG_ACTIVATION = MDCRippleFoundation.cssClasses.FG_ACTIVATION;

      this.adapter_.removeClass(FG_ACTIVATION);
      this.activationAnimationHasEnded_ = false;
      this.adapter_.computeBoundingRect();
    }
  }, {
    key: 'resetActivationState_',
    value: function resetActivationState_() {
      var _this12 = this;

      this.previousActivationEvent_ = this.activationState_.activationEvent;
      this.activationState_ = this.defaultActivationState_();
      // Touch devices may fire additional events for the same interaction within a short time.
      // Store the previous event until it's safe to assume that subsequent events are for new interactions.
      setTimeout(function () {
        return _this12.previousActivationEvent_ = null;
      }, MDCRippleFoundation.numbers.TAP_DELAY_MS);
    }

    /**
     * @param {?Event} e
     * @private
     */

  }, {
    key: 'deactivate_',
    value: function deactivate_(e) {
      var _this13 = this;

      var activationState = this.activationState_;
      // This can happen in scenarios such as when you have a keyup event that blurs the element.
      if (!activationState.isActivated) {
        return;
      }

      var state = /** @type {!ActivationStateType} */Object.assign({}, activationState);

      if (activationState.isProgrammatic) {
        var evtObject = null;
        requestAnimationFrame(function () {
          return _this13.animateDeactivation_(evtObject, state);
        });
        this.resetActivationState_();
      } else {
        this.deregisterDeactivationHandlers_();
        requestAnimationFrame(function () {
          _this13.activationState_.hasDeactivationUXRun = true;
          _this13.animateDeactivation_(e, state);
          _this13.resetActivationState_();
        });
      }
    }

    /**
     * @param {?Event=} event Optional event containing position information.
     */

  }, {
    key: 'deactivate',
    value: function deactivate() {
      var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      this.deactivate_(event);
    }

    /**
     * @param {Event} e
     * @param {!ActivationStateType} options
     * @private
     */

  }, {
    key: 'animateDeactivation_',
    value: function animateDeactivation_(e, _ref) {
      var wasActivatedByPointer = _ref.wasActivatedByPointer,
          wasElementMadeActive = _ref.wasElementMadeActive;

      if (wasActivatedByPointer || wasElementMadeActive) {
        this.runDeactivationUXLogicIfReady_();
      }
    }
  }, {
    key: 'layout',
    value: function layout() {
      var _this14 = this;

      if (this.layoutFrame_) {
        cancelAnimationFrame(this.layoutFrame_);
      }
      this.layoutFrame_ = requestAnimationFrame(function () {
        _this14.layoutInternal_();
        _this14.layoutFrame_ = 0;
      });
    }

    /** @private */

  }, {
    key: 'layoutInternal_',
    value: function layoutInternal_() {
      var _this15 = this;

      this.frame_ = this.adapter_.computeBoundingRect();
      var maxDim = Math.max(this.frame_.height, this.frame_.width);

      // Surface diameter is treated differently for unbounded vs. bounded ripples.
      // Unbounded ripple diameter is calculated smaller since the surface is expected to already be padded appropriately
      // to extend the hitbox, and the ripple is expected to meet the edges of the padded hitbox (which is typically
      // square). Bounded ripples, on the other hand, are fully expected to expand beyond the surface's longest diameter
      // (calculated based on the diagonal plus a constant padding), and are clipped at the surface's border via
      // `overflow: hidden`.
      var getBoundedRadius = function getBoundedRadius() {
        var hypotenuse = Math.sqrt(Math.pow(_this15.frame_.width, 2) + Math.pow(_this15.frame_.height, 2));
        return hypotenuse + MDCRippleFoundation.numbers.PADDING;
      };

      this.maxRadius_ = this.adapter_.isUnbounded() ? maxDim : getBoundedRadius();

      // Ripple is sized as a fraction of the largest dimension of the surface, then scales up using a CSS scale transform
      this.initialSize_ = maxDim * MDCRippleFoundation.numbers.INITIAL_ORIGIN_SCALE;
      this.fgScale_ = this.maxRadius_ / this.initialSize_;

      this.updateLayoutCssVars_();
    }

    /** @private */

  }, {
    key: 'updateLayoutCssVars_',
    value: function updateLayoutCssVars_() {
      var _MDCRippleFoundation$5 = MDCRippleFoundation.strings,
          VAR_FG_SIZE = _MDCRippleFoundation$5.VAR_FG_SIZE,
          VAR_LEFT = _MDCRippleFoundation$5.VAR_LEFT,
          VAR_TOP = _MDCRippleFoundation$5.VAR_TOP,
          VAR_FG_SCALE = _MDCRippleFoundation$5.VAR_FG_SCALE;


      this.adapter_.updateCssVariable(VAR_FG_SIZE, this.initialSize_ + 'px');
      this.adapter_.updateCssVariable(VAR_FG_SCALE, this.fgScale_);

      if (this.adapter_.isUnbounded()) {
        this.unboundedCoords_ = {
          left: Math.round(this.frame_.width / 2 - this.initialSize_ / 2),
          top: Math.round(this.frame_.height / 2 - this.initialSize_ / 2)
        };

        this.adapter_.updateCssVariable(VAR_LEFT, this.unboundedCoords_.left + 'px');
        this.adapter_.updateCssVariable(VAR_TOP, this.unboundedCoords_.top + 'px');
      }
    }

    /** @param {boolean} unbounded */

  }, {
    key: 'setUnbounded',
    value: function setUnbounded(unbounded) {
      var UNBOUNDED = MDCRippleFoundation.cssClasses.UNBOUNDED;

      if (unbounded) {
        this.adapter_.addClass(UNBOUNDED);
      } else {
        this.adapter_.removeClass(UNBOUNDED);
      }
    }
  }, {
    key: 'handleFocus',
    value: function handleFocus() {
      var _this16 = this;

      requestAnimationFrame(function () {
        return _this16.adapter_.addClass(MDCRippleFoundation.cssClasses.BG_FOCUSED);
      });
    }
  }, {
    key: 'handleBlur',
    value: function handleBlur() {
      var _this17 = this;

      requestAnimationFrame(function () {
        return _this17.adapter_.removeClass(MDCRippleFoundation.cssClasses.BG_FOCUSED);
      });
    }
  }]);

  return MDCRippleFoundation;
}(_foundation2.default);

exports.default = MDCRippleFoundation;

},{"./adapter":75,"./constants":76,"./util":79,"@material/base/foundation":74}],78:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.util = exports.RippleCapableSurface = exports.MDCRippleFoundation = exports.MDCRipple = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _component = require('@material/base/component');

var _component2 = _interopRequireDefault(_component);

var _adapter = require('./adapter');

var _adapter2 = _interopRequireDefault(_adapter);

var _foundation = require('./foundation');

var _foundation2 = _interopRequireDefault(_foundation);

var _util = require('./util');

var util = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @license
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Copyright 2016 Google Inc. All Rights Reserved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Licensed under the Apache License, Version 2.0 (the "License");
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * you may not use this file except in compliance with the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * You may obtain a copy of the License at
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *      http://www.apache.org/licenses/LICENSE-2.0
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Unless required by applicable law or agreed to in writing, software
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * distributed under the License is distributed on an "AS IS" BASIS,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * See the License for the specific language governing permissions and
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * limitations under the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

/**
 * @extends MDCComponent<!MDCRippleFoundation>
 */
var MDCRipple = function (_MDCComponent) {
  _inherits(MDCRipple, _MDCComponent);

  /** @param {...?} args */
  function MDCRipple() {
    var _ref;

    _classCallCheck(this, MDCRipple);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    /** @type {boolean} */
    var _this = _possibleConstructorReturn(this, (_ref = MDCRipple.__proto__ || Object.getPrototypeOf(MDCRipple)).call.apply(_ref, [this].concat(args)));

    _this.disabled = false;

    /** @private {boolean} */
    _this.unbounded_;
    return _this;
  }

  /**
   * @param {!Element} root
   * @param {{isUnbounded: (boolean|undefined)}=} options
   * @return {!MDCRipple}
   */


  _createClass(MDCRipple, [{
    key: 'setUnbounded_',


    /**
     * Closure Compiler throws an access control error when directly accessing a
     * protected or private property inside a getter/setter, like unbounded above.
     * By accessing the protected property inside a method, we solve that problem.
     * That's why this function exists.
     * @private
     */
    value: function setUnbounded_() {
      this.foundation_.setUnbounded(this.unbounded_);
    }
  }, {
    key: 'activate',
    value: function activate() {
      this.foundation_.activate();
    }
  }, {
    key: 'deactivate',
    value: function deactivate() {
      this.foundation_.deactivate();
    }
  }, {
    key: 'layout',
    value: function layout() {
      this.foundation_.layout();
    }

    /**
     * @return {!MDCRippleFoundation}
     * @override
     */

  }, {
    key: 'getDefaultFoundation',
    value: function getDefaultFoundation() {
      return new _foundation2.default(MDCRipple.createAdapter(this));
    }

    /** @override */

  }, {
    key: 'initialSyncWithDOM',
    value: function initialSyncWithDOM() {
      this.unbounded = 'mdcRippleIsUnbounded' in this.root_.dataset;
    }
  }, {
    key: 'unbounded',


    /** @return {boolean} */
    get: function get() {
      return this.unbounded_;
    }

    /** @param {boolean} unbounded */
    ,
    set: function set(unbounded) {
      this.unbounded_ = Boolean(unbounded);
      this.setUnbounded_();
    }
  }], [{
    key: 'attachTo',
    value: function attachTo(root) {
      var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref2$isUnbounded = _ref2.isUnbounded,
          isUnbounded = _ref2$isUnbounded === undefined ? undefined : _ref2$isUnbounded;

      var ripple = new MDCRipple(root);
      // Only override unbounded behavior if option is explicitly specified
      if (isUnbounded !== undefined) {
        ripple.unbounded = /** @type {boolean} */isUnbounded;
      }
      return ripple;
    }

    /**
     * @param {!RippleCapableSurface} instance
     * @return {!MDCRippleAdapter}
     */

  }, {
    key: 'createAdapter',
    value: function createAdapter(instance) {
      var MATCHES = util.getMatchesProperty(HTMLElement.prototype);

      return {
        browserSupportsCssVars: function browserSupportsCssVars() {
          return util.supportsCssVariables(window);
        },
        isUnbounded: function isUnbounded() {
          return instance.unbounded;
        },
        isSurfaceActive: function isSurfaceActive() {
          return instance.root_[MATCHES](':active');
        },
        isSurfaceDisabled: function isSurfaceDisabled() {
          return instance.disabled;
        },
        addClass: function addClass(className) {
          return instance.root_.classList.add(className);
        },
        removeClass: function removeClass(className) {
          return instance.root_.classList.remove(className);
        },
        containsEventTarget: function containsEventTarget(target) {
          return instance.root_.contains(target);
        },
        registerInteractionHandler: function registerInteractionHandler(evtType, handler) {
          return instance.root_.addEventListener(evtType, handler, util.applyPassive());
        },
        deregisterInteractionHandler: function deregisterInteractionHandler(evtType, handler) {
          return instance.root_.removeEventListener(evtType, handler, util.applyPassive());
        },
        registerDocumentInteractionHandler: function registerDocumentInteractionHandler(evtType, handler) {
          return document.documentElement.addEventListener(evtType, handler, util.applyPassive());
        },
        deregisterDocumentInteractionHandler: function deregisterDocumentInteractionHandler(evtType, handler) {
          return document.documentElement.removeEventListener(evtType, handler, util.applyPassive());
        },
        registerResizeHandler: function registerResizeHandler(handler) {
          return window.addEventListener('resize', handler);
        },
        deregisterResizeHandler: function deregisterResizeHandler(handler) {
          return window.removeEventListener('resize', handler);
        },
        updateCssVariable: function updateCssVariable(varName, value) {
          return instance.root_.style.setProperty(varName, value);
        },
        computeBoundingRect: function computeBoundingRect() {
          return instance.root_.getBoundingClientRect();
        },
        getWindowPageOffset: function getWindowPageOffset() {
          return { x: window.pageXOffset, y: window.pageYOffset };
        }
      };
    }
  }]);

  return MDCRipple;
}(_component2.default);

/**
 * See Material Design spec for more details on when to use ripples.
 * https://material.io/guidelines/motion/choreography.html#choreography-creation
 * @record
 */


var RippleCapableSurface = function RippleCapableSurface() {
  _classCallCheck(this, RippleCapableSurface);
};

/** @protected {!Element} */


RippleCapableSurface.prototype.root_;

/**
 * Whether or not the ripple bleeds out of the bounds of the element.
 * @type {boolean|undefined}
 */
RippleCapableSurface.prototype.unbounded;

/**
 * Whether or not the ripple is attached to a disabled component.
 * @type {boolean|undefined}
 */
RippleCapableSurface.prototype.disabled;

exports.MDCRipple = MDCRipple;
exports.MDCRippleFoundation = _foundation2.default;
exports.RippleCapableSurface = RippleCapableSurface;
exports.util = util;

},{"./adapter":75,"./foundation":77,"./util":79,"@material/base/component":73}],79:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * @license
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Stores result from supportsCssVariables to avoid redundant processing to detect CSS custom variable support.
 * @private {boolean|undefined}
 */
var supportsCssVariables_ = void 0;

/**
 * Stores result from applyPassive to avoid redundant processing to detect passive event listener support.
 * @private {boolean|undefined}
 */
var supportsPassive_ = void 0;

/**
 * @param {!Window} windowObj
 * @return {boolean}
 */
function detectEdgePseudoVarBug(windowObj) {
  // Detect versions of Edge with buggy var() support
  // See: https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/11495448/
  var document = windowObj.document;
  var node = document.createElement('div');
  node.className = 'mdc-ripple-surface--test-edge-var-bug';
  document.body.appendChild(node);

  // The bug exists if ::before style ends up propagating to the parent element.
  // Additionally, getComputedStyle returns null in iframes with display: "none" in Firefox,
  // but Firefox is known to support CSS custom properties correctly.
  // See: https://bugzilla.mozilla.org/show_bug.cgi?id=548397
  var computedStyle = windowObj.getComputedStyle(node);
  var hasPseudoVarBug = computedStyle !== null && computedStyle.borderTopStyle === 'solid';
  node.remove();
  return hasPseudoVarBug;
}

/**
 * @param {!Window} windowObj
 * @param {boolean=} forceRefresh
 * @return {boolean|undefined}
 */

function supportsCssVariables(windowObj) {
  var forceRefresh = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var supportsCssVariables = supportsCssVariables_;
  if (typeof supportsCssVariables_ === 'boolean' && !forceRefresh) {
    return supportsCssVariables;
  }

  var supportsFunctionPresent = windowObj.CSS && typeof windowObj.CSS.supports === 'function';
  if (!supportsFunctionPresent) {
    return;
  }

  var explicitlySupportsCssVars = windowObj.CSS.supports('--css-vars', 'yes');
  // See: https://bugs.webkit.org/show_bug.cgi?id=154669
  // See: README section on Safari
  var weAreFeatureDetectingSafari10plus = windowObj.CSS.supports('(--css-vars: yes)') && windowObj.CSS.supports('color', '#00000000');

  if (explicitlySupportsCssVars || weAreFeatureDetectingSafari10plus) {
    supportsCssVariables = !detectEdgePseudoVarBug(windowObj);
  } else {
    supportsCssVariables = false;
  }

  if (!forceRefresh) {
    supportsCssVariables_ = supportsCssVariables;
  }
  return supportsCssVariables;
}

//
/**
 * Determine whether the current browser supports passive event listeners, and if so, use them.
 * @param {!Window=} globalObj
 * @param {boolean=} forceRefresh
 * @return {boolean|{passive: boolean}}
 */
function applyPassive() {
  var globalObj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window;
  var forceRefresh = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  if (supportsPassive_ === undefined || forceRefresh) {
    var isSupported = false;
    try {
      globalObj.document.addEventListener('test', null, { get passive() {
          isSupported = true;
        } });
    } catch (e) {}

    supportsPassive_ = isSupported;
  }

  return supportsPassive_ ? { passive: true } : false;
}

/**
 * @param {!Object} HTMLElementPrototype
 * @return {!Array<string>}
 */
function getMatchesProperty(HTMLElementPrototype) {
  return ['webkitMatchesSelector', 'msMatchesSelector', 'matches'].filter(function (p) {
    return p in HTMLElementPrototype;
  }).pop();
}

/**
 * @param {!Event} ev
 * @param {{x: number, y: number}} pageOffset
 * @param {!ClientRect} clientRect
 * @return {{x: number, y: number}}
 */
function getNormalizedEventCoords(ev, pageOffset, clientRect) {
  var x = pageOffset.x,
      y = pageOffset.y;

  var documentX = x + clientRect.left;
  var documentY = y + clientRect.top;

  var normalizedX = void 0;
  var normalizedY = void 0;
  // Determine touch point relative to the ripple container.
  if (ev.type === 'touchstart') {
    normalizedX = ev.changedTouches[0].pageX - documentX;
    normalizedY = ev.changedTouches[0].pageY - documentY;
  } else {
    normalizedX = ev.pageX - documentX;
    normalizedY = ev.pageY - documentY;
  }

  return { x: normalizedX, y: normalizedY };
}

exports.supportsCssVariables = supportsCssVariables;
exports.applyPassive = applyPassive;
exports.getMatchesProperty = getMatchesProperty;
exports.getNormalizedEventCoords = getNormalizedEventCoords;

},{}],80:[function(require,module,exports){
'use strict';

var ripple = require('@material/ripple');
var event = require('peako/event');

event.on(document, 'ontouchstart' in self ? 'ontouchstart' : 'click', '.mdc-button', function () {
  if (!this._ripple) {
    this._ripple = new ripple.MDCRipple(this);
  }
}, false);

},{"@material/ripple":78,"peako/event":44}]},{},[80]);
