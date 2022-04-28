"use strict";

DAWCore.actions.set( "removeBlocks", ( blcIds, get ) => {
	const blocks = blcIds.reduce( ( obj, id ) => {
		obj[ id ] = undefined;
		return obj;
	}, {} );
	const obj = { blocks };
	const dur = DAWCore.actionsCommon.calcNewDuration( obj, get );
	let selLen = 0;

	Object.entries( get.blocks() ).forEach( ( [ id, blc ] ) => {
		if ( blc.selected && !( id in blocks ) ) {
			++selLen;
			blocks[ id ] = { selected: false };
		}
	} );
	if ( dur !== get.duration() ) {
		obj.duration = dur;
	}
	return [
		obj,
		blcIds.length
			? [ "blocks", "removeBlocks", blcIds.length ]
			: [ "blocks", "unselectAllBlocks", selLen ],
	];
} );
