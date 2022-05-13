"use strict";

DAWCore.actions.set( "changePatternBufferInfo", ( daw, id, { name, type, bpm } ) => {
	const pat = daw.$getPattern( id );
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
		const bufDur = daw.$getBuffer( pat.buffer ).duration;
		const dur = objPat.bufferBpm
			? Math.round( bufDur * ( objPat.bufferBpm / 60 ) )
			: Math.ceil( bufDur * daw.$getBPS() );

		DAWCore.actionsCommon.updatePatternDuration( daw, obj, id, dur );
		Object.entries( daw.$getPatterns() )
			.filter( kv => kv[ 1 ].type === "slices" && kv[ 1 ].source === id )
			.forEach( kv => DAWCore.actionsCommon.updatePatternDuration( daw, obj, kv[ 0 ], dur ) );
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
