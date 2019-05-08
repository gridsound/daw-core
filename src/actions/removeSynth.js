"use strict";

DAWCore.prototype.removeSynth = function( id ) {
	const syn = this.get.synth( id );

	syn
		? this.compositionChange( this._removeSynth( id ) )
		: this._error( "removeSynth", "synths", id );
};

DAWCore.prototype._removeSynth = function( synthId ) {
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
	if ( !DAWCore.objectIsEmpty( keys ) ) {
		obj.keys = keys;
		obj.patterns = patterns;
		if ( !DAWCore.objectIsEmpty( blocks ) ) {
			obj.blocks = blocks;
		}
	}
	if ( synthId === this.get.synthOpened() ) {
		if ( !Object.keys( this.get.synths() ).some( k => {
			if ( k !== synthId ) {
				obj.synthOpened = k;
				if ( !cmpPatterns.some( ( [ patId, pat ] ) => {
					if ( pat.synth === k ) {
						obj.patternOpened = patId;
						return true;
					}
				} ) ) {
					obj.patternOpened = null;
				}
				return true;
			}
		} ) ) {
			obj.synthOpened = null;
		}
	}
	return obj;
};
