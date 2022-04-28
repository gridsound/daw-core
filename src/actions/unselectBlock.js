"use strict";

DAWCore.actions.set( "unselectBlock", id => {
	return [
		{ blocks: { [ id ]: { selected: false } } },
		[ "blocks", "unselectBlock" ],
	];
} );
