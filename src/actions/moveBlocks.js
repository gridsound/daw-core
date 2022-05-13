"use strict";

DAWCore.actions.set( "moveBlocks", ( blcIds, whenIncr, trackIncr, _get, daw ) => {
	const blocks = {};
	const obj = { blocks };
	const tr = Object.entries( daw.get.tracks() ).sort( ( a, b ) => a[ 1 ].order < b[ 1 ].order );

	blcIds.forEach( id => {
		const blc = daw.get.block( id );
		const obj = {};

		blocks[ id ] = obj;
		if ( whenIncr ) {
			obj.when = blc.when + whenIncr;
		}
		if ( trackIncr ) {
			obj.track = tr[ tr.findIndex( kv => kv[ 0 ] === blc.track ) + trackIncr ][ 0 ];
		}
	} );
	if ( whenIncr ) {
		const dur = DAWCore.actionsCommon.calcNewDuration( obj, daw );

		if ( dur !== daw.get.duration() ) {
			obj.duration = dur;
		}
	}
	return [
		obj,
		[ "blocks", "moveBlocks", blcIds.length ],
	];
} );
