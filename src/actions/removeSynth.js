"use strict";

DAWCoreActions.set( "removeSynth", ( daw, synthId ) => {
	const keys = {};
	const blocks = {};
	const patterns = {};
	const cmpBlocks = Object.entries( daw.$getBlocks() );
	const cmpPatterns = Object.entries( daw.$getPatterns() );
	const obj = { synths: { [ synthId ]: undefined } };

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
	DAWCoreUtils.$addIfNotEmpty( obj, "keys", keys );
	DAWCoreUtils.$addIfNotEmpty( obj, "patterns", patterns );
	DAWCoreUtils.$addIfNotEmpty( obj, "blocks", blocks );
	if ( synthId === daw.$getOpened( "synth" ) ) {
		if ( !Object.keys( daw.$getSynths() ).some( k => {
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
		[ "synths", "removeSynth", daw.$getSynth( synthId ).name ],
	];
} );
