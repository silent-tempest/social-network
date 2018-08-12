'use strict';

/**
 * @param {number} value
 * @param {number} index
 * @returns {string[2]}
 */
function locale ( value, index ) {
  switch ( index ) {
    case 0:
      return [ 'только что', 'прямо сейчас' ];
    case 6:
      return [ 'вчера', 'завтра' ];
  }

  return format( Math.floor( 0.5 * index ), value );
}

var formats = [
  [ 'секунду', 'секунды',  'секунд' ],
  [  'минуту',  'минуты',   'минут' ],
  [     'час',    'часа',   'часов' ],
  [    'день',     'дня',    'дней' ],
  [  'неделю',  'недели',  'недель' ],
  [   'месяц',  'месяца', 'месяцев' ],
  [     'год',    'года',     'лет' ]
];

/**
 * @param {number} kind
 * @param {number} value
 * @returns {string[2]}
 */
function format ( kind, value ) {
  var format = formats[ kind ];
  var i, x;

  if ( value === 1 ) {
    return [ format[ 0 ] + ' назад', 'через ' + format[ 0 ] ];
  }

  if ( value > 20 ) {
    x = value % 10;
  } else {
    x = value;
  }

  if ( x === 1 ) {
    i = 0;
  } else if ( x >= 2 && x < 5 ) {
    i = 1;
  } else {
    i = 2;
  }

  return [ '%s ' + format[ i ] + ' назад', 'через %s ' + format[ i ] ];
}

module.exports = locale;
