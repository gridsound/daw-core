"use strict";

DAWCore.actions.unselectAllBlocks = get => {
	let len = 0;
	const blocks = Object.entries( get.blocks() ).reduce( ( obj, [ id, blc ] ) => {
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
};
