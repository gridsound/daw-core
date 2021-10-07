"use strict";

DAWCore.actions.removePattern = ( patId, get ) => {
	const pat = get.pattern( patId ),
		type = pat.type,
		typeOpe = DAWCore.actions.common.patternOpenedByType[ type ],
		obj = { patterns: { [ patId ]: undefined } },
		blocks = Object.entries( get.blocks() ).reduce( ( blocks, [ blcId, blc ] ) => {
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
	} else {
		obj[ type ] = { [ pat[ type ] ]: undefined };
	}
	if ( DAWCore.utils.isntEmpty( blocks ) ) {
		const realDur = Object.values( get.blocks() )
				.reduce( ( dur, blc ) => {
					return blc.pattern === patId
						? dur
						: Math.max( dur, blc.when + blc.duration );
				}, 0 ),
			bPM = get.beatsPerMeasure(),
			dur = Math.max( 1, Math.ceil( realDur / bPM ) ) * bPM;

		obj.blocks = blocks;
		if ( dur !== get.duration() ) {
			obj.duration = dur;
		}
	}
	if ( patId === get[ typeOpe ]() ) {
		const found = Object.entries( get.patterns() )
				.find( ( [ k, v ] ) => k !== patId && v.type === type && v.synth === pat.synth );

		obj[ typeOpe ] = found ? found[ 0 ] : null;
	}
	return [
		obj,
		[ "patterns", "removePattern", pat.type, pat.name ],
	];
};
