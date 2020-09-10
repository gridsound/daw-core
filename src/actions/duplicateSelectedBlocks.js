"use strict";

DAWCore.actions.duplicateSelectedBlocks = ( whenIncr, get ) => {
	const sel = Object.entries( get.blocks() ).filter( kv => kv[ 1 ].selected ),
		newId = +DAWCore.common.getNextIdOf( get.blocks() ),
		blocks = sel.reduce( ( obj, [ id, blc ], i ) => {
			const cpy = { ...blc };

			cpy.when += whenIncr;
			obj[ id ] = { selected: false };
			obj[ newId + i ] = cpy;
			return obj;
		}, {} ),
		obj = { blocks },
		dur = DAWCore.common.calcNewDuration( obj, get );

	if ( dur !== get.duration() ) {
		obj.duration = dur;
	}
	return [
		obj,
		[ "blocks", "duplicateSelectedBlocks", sel.length ],
	];
};
