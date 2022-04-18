"use strict";

DAWCore.actions.duplicateSelectedBlocks = ( whenIncr, get ) => {
	const sel = Object.entries( get.blocks() ).filter( kv => kv[ 1 ].selected );
	const newId = +DAWCore.actions.common.getNextIdOf( get.blocks() );
	const blocks = sel.reduce( ( obj, [ id, blc ], i ) => {
		const cpy = { ...blc };

		cpy.when += whenIncr;
		obj[ id ] = { selected: false };
		obj[ newId + i ] = cpy;
		return obj;
	}, {} );
	const obj = { blocks };
	const dur = DAWCore.actions.common.calcNewDuration( obj, get );

	if ( dur !== get.duration() ) {
		obj.duration = dur;
	}
	return [
		obj,
		[ "blocks", "duplicateSelectedBlocks", sel.length ],
	];
};
