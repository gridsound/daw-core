"use strict";

DAWCore.actions.selectBlocks = ( blcIds, get ) => {
	const blocks = blcIds.reduce( ( obj, id ) => {
			obj[ id ] = { selected: true };
			return obj;
		}, {} );

	return [
		{ blocks },
		[ "blocks", "selectBlocks", blcIds.length ],
	];
};
