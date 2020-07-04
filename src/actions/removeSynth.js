"use strict";

DAWCore.actions.removeSynth = ( synthId, get ) => {
	const keys = {},
		blocks = {},
		patterns = {},
		cmpBlocks = Object.entries( get.blocks() ),
		cmpPatterns = Object.entries( get.patterns() ),
		obj = { synths: { [ synthId ]: undefined } };

	cmpPatterns.forEach( ( [ patId, pat ] ) => {
		if ( pat.synth === synthId ) {
			keys[ pat.keys ] =
			patterns[ patId ] = undefined;
			cmpBlocks.forEach( ( [ blcId, blc ] ) => {
				if ( blc.pattern === patId ) {
					blocks[ blcId ] = undefined;
				}
			} );
		}
	} );
	GSUtils.addIfNotEmpty( obj, "keys", keys );
	GSUtils.addIfNotEmpty( obj, "patterns", patterns );
	GSUtils.addIfNotEmpty( obj, "blocks", blocks );
	if ( synthId === get.synthOpened() ) {
		if ( !Object.keys( get.synths() ).some( k => {
			if ( k !== synthId ) {
				obj.synthOpened = k;
				if ( !cmpPatterns.some( ( [ patId, pat ] ) => {
					if ( pat.synth === k ) {
						obj.patternKeysOpened = patId;
						return true;
					}
				} ) ) {
					obj.patternKeysOpened = null;
				}
				return true;
			}
		} ) ) {
			obj.synthOpened = null;
		}
	}
	return [
		obj,
		[ "synths", "removeSynth", get.synth( synthId ).name ],
	];
};
