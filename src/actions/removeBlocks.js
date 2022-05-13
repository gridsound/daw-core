"use strict";

DAWCore.actions.set( "removeBlocks", ( blcIds, _get, daw ) => {
	const blocks = blcIds.reduce( ( obj, id ) => {
		obj[ id ] = undefined;
		return obj;
	}, {} );
	const obj = { blocks };
	const dur = DAWCore.actionsCommon.calcNewDuration( obj, daw );
	let selLen = 0;

	Object.entries( daw.get.blocks() ).forEach( ( [ id, blc ] ) => {
		if ( blc.selected && !( id in blocks ) ) {
			++selLen;
			blocks[ id ] = { selected: false };
		}
	} );
	if ( dur !== daw.get.duration() ) {
		obj.duration = dur;
	}
	return [
		obj,
		blcIds.length
			? [ "blocks", "removeBlocks", blcIds.length ]
			: [ "blocks", "unselectAllBlocks", selLen ],
	];
} );
