"use strict";

DAWCore.actions.set( "selectBlocks", blcIds => {
	const blocks = blcIds.reduce( ( obj, id ) => {
		obj[ id ] = { selected: true };
		return obj;
	}, {} );

	return [
		{ blocks },
		[ "blocks", "selectBlocks", blcIds.length ],
	];
} );
