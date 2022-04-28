"use strict";

DAWCore.actions.set( "changePatternBufferInfo", ( id, { name, type, bpm }, get ) => {
	const pat = get.pattern( id );
	const obj = {};
	const objPat = {};

	if ( name !== pat.name ) {
		objPat.name = name;
	}
	if ( type !== pat.bufferType ) {
		objPat.bufferType = type;
		if ( pat.bufferType === "loop" ) {
			objPat.bufferBpm = undefined;
		}
	}
	if ( bpm !== pat.bufferBpm && type === "loop" ) {
		objPat.bufferBpm = bpm;
	}
	if ( "bufferBpm" in objPat ) {
		const bufDur = get.buffer( pat.buffer ).duration;
		const dur = objPat.bufferBpm
			? Math.round( bufDur * ( objPat.bufferBpm / 60 ) )
			: Math.ceil( bufDur * get.bps() );

		DAWCore.actionsCommon.updatePatternDuration( obj, id, dur, get );
		Object.entries( get.patterns() )
			.filter( kv => kv[ 1 ].type === "slices" && kv[ 1 ].source === id )
			.forEach( kv => DAWCore.actionsCommon.updatePatternDuration( obj, kv[ 0 ], dur, get ) );
	}
	if ( DAWCore.utils.isntEmpty( objPat ) ) {
		DAWCore.utils.deepAssign( obj, { patterns: { [ id ]: objPat } } );
	}
	if ( DAWCore.utils.isntEmpty( obj ) ) {
		return [
			obj,
			[ "patterns", "changePatternBufferInfo", name || pat.name ],
		];
	}
} );
