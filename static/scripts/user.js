'use strict';

if ( top !== self ) {
  top.location = self.location;
}

var ripple = require( '@material/ripple' );
var event  = require( 'peako/event' );

event.on( document, 'ontouchstart' in self ? 'ontouchstart' : 'click', '.mdc-button', function () {
  if ( ! this._ripple ) {
    this._ripple = new ripple.MDCRipple( this );
  }
}, false );
