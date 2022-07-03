"use strict";

DAWCoreActions.set( "moveBlocks", ( daw, blcIds, whenIncr, trackIncr ) => {
	const blocks = {};
	const obj = { blocks };
	const tr = Object.entries( daw.$getTracks() ).sort( ( a, b ) => a[ 1 ].order < b[ 1 ].order );

	blcIds.forEach( id => {
		const blc = daw.$getBlock( id );
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
		const dur = DAWCoreActionsCommon.calcNewDuration( daw, obj );

		if ( dur !== daw.$getDuration() ) {
			obj.duration = dur;
		}
	}
	return [
		obj,
		[ "blocks", "moveBlocks", blcIds.length ],
	];
} );
