"use strict";

DAWCore.actions.removePattern = function( patId ) {
	const get = this.get,
		pat = get.pattern( patId ),
		type = pat.type,
		obj = { patterns: { [ patId ]: undefined } },
		blocks = Object.entries( get.blocks() ).reduce( ( blocks, [ blcId, blc ] ) => {
			if ( blc.pattern === patId ) {
				blocks[ blcId ] = undefined;
			}
			return blocks;
		}, {} );

	if ( type !== "buffer" ) {
		obj[ type ] = { [ pat[ type ] ]: undefined };
	}
	if ( GSData.isntEmpty( blocks ) ) {
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
