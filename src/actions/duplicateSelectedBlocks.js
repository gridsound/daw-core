"use strict";

DAWCore.actions.set( "duplicateSelectedBlocks", ( daw, whenIncr ) => {
	const sel = Object.entries( daw.$getBlocks() ).filter( kv => kv[ 1 ].selected );
	const newId = +DAWCore.actionsCommon.getNextIdOf( daw.$getBlocks() );
	const blocks = sel.reduce( ( obj, [ id, blc ], i ) => {
		const cpy = { ...blc };

		cpy.when += whenIncr;
		obj[ id ] = { selected: false };
		obj[ newId + i ] = cpy;
		return obj;
	}, {} );
	const obj = { blocks };
	const dur = DAWCore.actionsCommon.calcNewDuration( daw, obj );

	if ( dur !== daw.$getDuration() ) {
		obj.duration = dur;
	}
	return [
		obj,
		[ "blocks", "duplicateSelectedBlocks", sel.length ],
	];
} );
