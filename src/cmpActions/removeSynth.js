"use strict";

DAWCore.actions.removeSynth = function( synthId ) {
	const keys = {},
		blocks = {},
		patterns = {},
		cmpBlocks = Object.entries( this.get.blocks() ),
		cmpPatterns = Object.entries( this.get.patterns() ),
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
	DAWCore.utils.addIfNotEmpty( obj, "keys", keys );
	DAWCore.utils.addIfNotEmpty( obj, "patterns", patterns );
	DAWCore.utils.addIfNotEmpty( obj, "blocks", blocks );
	if ( synthId === this.get.synthOpened() ) {
		if ( !Object.keys( this.get.synths() ).some( k => {
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
		[ "synths", "removeSynth", this.get.synth( synthId ).name ],
	];
};
