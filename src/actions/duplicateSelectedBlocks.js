"use strict";

DAWCore.actions.set( "duplicateSelectedBlocks", ( whenIncr, _get, daw ) => {
	const sel = Object.entries( daw.get.blocks() ).filter( kv => kv[ 1 ].selected );
	const newId = +DAWCore.actionsCommon.getNextIdOf( daw.get.blocks() );
	const blocks = sel.reduce( ( obj, [ id, blc ], i ) => {
		const cpy = { ...blc };

		cpy.when += whenIncr;
		obj[ id ] = { selected: false };
		obj[ newId + i ] = cpy;
		return obj;
	}, {} );
	const obj = { blocks };
	const dur = DAWCore.actionsCommon.calcNewDuration( obj, daw );

	if ( dur !== daw.get.duration() ) {
		obj.duration = dur;
	}
	return [
		obj,
		[ "blocks", "duplicateSelectedBlocks", sel.length ],
	];
} );
