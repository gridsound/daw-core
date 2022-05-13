"use strict";

DAWCore.actions.set( "selectBlocks", ( _daw, blcIds ) => {
	const blocks = blcIds.reduce( ( obj, id ) => {
		obj[ id ] = { selected: true };
		return obj;
	}, {} );

	return [
		{ blocks },
		[ "blocks", "selectBlocks", blcIds.length ],
	];
} );
