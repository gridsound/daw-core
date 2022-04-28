"use strict";

DAWCore.actions.moveBlocks = ( blcIds, whenIncr, trackIncr, get ) => {
	const blocks = {};
	const obj = { blocks };
	const tr = Object.entries( get.tracks() ).sort( ( a, b ) => a[ 1 ].order < b[ 1 ].order );

	blcIds.forEach( id => {
		const blc = get.block( id );
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
		const dur = DAWCore.actionsCommon.calcNewDuration( obj, get );

		if ( dur !== get.duration() ) {
			obj.duration = dur;
		}
	}
	return [
		obj,
		[ "blocks", "moveBlocks", blcIds.length ],
	];
};
