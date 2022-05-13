"use strict";

DAWCore.actions.set( "removeBlocks", ( daw, blcIds ) => {
	const blocks = blcIds.reduce( ( obj, id ) => {
		obj[ id ] = undefined;
		return obj;
	}, {} );
	const obj = { blocks };
	const dur = DAWCore.actionsCommon.calcNewDuration( daw, obj );
	let selLen = 0;

	Object.entries( daw.$getBlocks() ).forEach( ( [ id, blc ] ) => {
		if ( blc.selected && !( id in blocks ) ) {
			++selLen;
			blocks[ id ] = { selected: false };
		}
	} );
	if ( dur !== daw.$getDuration() ) {
		obj.duration = dur;
	}
	return [
		obj,
		blcIds.length
			? [ "blocks", "removeBlocks", blcIds.length ]
			: [ "blocks", "unselectAllBlocks", selLen ],
	];
} );
