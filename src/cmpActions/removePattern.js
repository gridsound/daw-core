"use strict";

DAWCore.actions.removePattern = ( patId, get ) => {
	const pat = get.pattern( patId ),
		type = pat.type,
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
				GSUtils.deepAssign( obj,
					DAWCore.actions._removeDrumrow( obj, kv[ 0 ], get ) );
			}
		} );
	} else {
		obj[ type ] = { [ pat[ type ] ]: undefined };
	}
	if ( GSUtils.isntEmpty( blocks ) ) {
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
	if ( type === "keys" ) {
		if ( patId === get.patternKeysOpened() ) {
			if ( !Object.entries( get.patterns() ).some( ( [ k, v ] ) => {
				if ( k !== patId && v.synth === pat.synth ) {
					obj.patternKeysOpened = k;
					return true;
				}
			} ) ) {
				obj.patternKeysOpened = null;
			}
		}
	} else if ( type === "drums" ) {
		if ( patId === get.patternDrumsOpened() ) {
			if ( !Object.entries( get.patterns() ).some( ( [ k, v ] ) => {
				if ( k !== patId && v.type === "drums" ) {
					obj.patternDrumsOpened = k;
					return true;
				}
			} ) ) {
				obj.patternDrumsOpened = null;
			}
		}
	}
	return [
		obj,
		[ "patterns", "removePattern", pat.type, pat.name ],
	];
};
