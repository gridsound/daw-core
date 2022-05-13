"use strict";

DAWCore.actions.set( "unselectAllBlocks", daw => {
	let len = 0;
	const blocks = Object.entries( daw.get.blocks() ).reduce( ( obj, [ id, blc ] ) => {
		if ( blc.selected ) {
			++len;
			obj[ id ] = { selected: false };
		}
		return obj;
	}, {} );

	return [
		{ blocks },
		[ "blocks", "unselectAllBlocks", len ],
	];
} );
