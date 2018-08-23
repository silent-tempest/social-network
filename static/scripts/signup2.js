'use strict';

if ( top !== self ) {
  top.location = self.location;
}

[].forEach.call( document.querySelectorAll( '.input--group' ), require( 'waft.input' ) );
