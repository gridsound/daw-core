"use strict";

DAWCoreActions.changePatternBufferInfo = ( daw, id, { name, type, bpm, reverse } ) => {
	const pat = daw.$getPattern( id );
	const buf = daw.$getBuffer( pat.buffer );
	const obj = {};
	const objPat = {};
	const objBuf = {};

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
	if ( reverse !== buf.reverse ) {
		objBuf.reverse = reverse;
	}
	if ( "bufferBpm" in objPat ) {
		const dur = objPat.bufferBpm
			? Math.round( buf.duration * ( objPat.bufferBpm / 60 ) )
			: Math.ceil( buf.duration * daw.$getBPS() );

		DAWCoreActionsCommon_updatePatternDuration( daw, obj, id, dur );
		Object.entries( daw.$getPatterns() )
			.filter( kv => kv[ 1 ].type === "slices" && kv[ 1 ].source === id )
			.forEach( kv => DAWCoreActionsCommon_updatePatternDuration( daw, obj, kv[ 0 ], dur ) );
	}
	if ( GSUisntEmpty( objPat ) ) {
		GSUdeepAssign( obj, { patterns: { [ id ]: objPat } } );
	}
	if ( GSUisntEmpty( objBuf ) ) {
		GSUdeepAssign( obj, { buffers: { [ pat.buffer ]: objBuf } } );
	}
	if ( GSUisntEmpty( obj ) ) {
		return [
			obj,
			[ "patterns", "changePatternBufferInfo", name || pat.name ],
		];
	}
};
