"use strict";

DAWCore.actions.removePattern = ( patId, get ) => {
	const pat = get.pattern( patId );
	const type = pat.type;
	const obj = { patterns: { [ patId ]: undefined } };
	const blocks = Object.entries( get.blocks() ).reduce( ( blocks, [ blcId, blc ] ) => {
		if ( blc.pattern === patId ) {
			blocks[ blcId ] = undefined;
		}
		return blocks;
	}, {} );

	if ( type === "buffer" ) {
		Object.entries( get.drumrows() ).forEach( kv => {
			if ( kv[ 1 ].pattern === patId ) {
				DAWCore.utils.deepAssign( obj,
					DAWCore.actions._removeDrumrow( obj, kv[ 0 ], get ) );
			}
		} );
		Object.entries( get.patterns() ).forEach( kv => {
			if ( kv[ 1 ].type === "slices" && kv[ 1 ].source === patId ) {
				obj.patterns[ kv[ 0 ] ] = { source: null };
			}
		} );
		obj.buffers = { [ pat.buffer ]: undefined };
	} else {
		obj[ type ] = { [ pat[ type ] ]: undefined };
	}
	if ( DAWCore.utils.isntEmpty( blocks ) ) {
		const realDur = Object.values( get.blocks() )
			.reduce( ( dur, blc ) => {
				return blc.pattern === patId
					? dur
					: Math.max( dur, blc.when + blc.duration );
			}, 0 );
		const bPM = get.beatsPerMeasure();
		const dur = Math.max( 1, Math.ceil( realDur / bPM ) ) * bPM;

		obj.blocks = blocks;
		if ( dur !== get.duration() ) {
			obj.duration = dur;
		}
	}
	if ( patId === get.opened( type ) ) {
		const found = Object.entries( get.patterns() )
			.find( ( [ k, v ] ) => k !== patId && v.type === type && v.synth === pat.synth );

		obj[ DAWCore.actions.common.patternOpenedByType[ type ] ] = found ? found[ 0 ] : null;
	}
	return [
		obj,
		[ "patterns", "removePattern", pat.type, pat.name ],
	];
};
