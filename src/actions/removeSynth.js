"use strict";

DAWCore.actions.set( "removeSynth", ( synthId, _get, daw ) => {
	const keys = {};
	const blocks = {};
	const patterns = {};
	const cmpBlocks = Object.entries( daw.get.blocks() );
	const cmpPatterns = Object.entries( daw.get.patterns() );
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
	DAWCore.utils.addIfNotEmpty( obj, "keys", keys );
	DAWCore.utils.addIfNotEmpty( obj, "patterns", patterns );
	DAWCore.utils.addIfNotEmpty( obj, "blocks", blocks );
	if ( synthId === daw.$getOpened( "synth" ) ) {
		if ( !Object.keys( daw.get.synths() ).some( k => {
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
		[ "synths", "removeSynth", daw.get.synth( synthId ).name ],
	];
} );
