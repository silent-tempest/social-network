'use strict';

if ( top !== self ) {
  top.location = self.location;
}

var format = require( './lib/mytimeago' );
var locale = require( './lib/mytimeago__locale--ru' );

var UI = {
  init: function init () {
    var self = this;

    setInterval( function () {
      self.update();
    }, 1000 );
  },

  update: function update () {
    var i, activity;

    for ( i = this.activities.length - 1; i >= 0; --i ) {
      if ( ( activity = this.activities[ i ].getAttribute( 'data-activity' ) ) ) {
        this.activities[ i ].innerHTML = format( new Date( activity ), locale );
      }
    }
  },

  activities: document.getElementsByClassName( 'activity' )
};

UI.init();
