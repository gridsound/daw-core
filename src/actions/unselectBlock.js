"use strict";

DAWCore.actions.set( "unselectBlock", ( _daw, id ) => {
	return [
		{ blocks: { [ id ]: { selected: false } } },
		[ "blocks", "unselectBlock" ],
	];
} );
