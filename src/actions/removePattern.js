"use strict";

DAWCore.prototype.removePattern = function( id ) {
	const pat = this.get.pattern( id );

	pat
		? this.compositionChange( this._removePattern( id, pat ) )
		: this._error( "removePattern", "patterns", id );
};

DAWCore.prototype._removePattern = function( patId, pat ) {
	const obj = {
			keys: { [ pat.keys ]: undefined },
			patterns: { [ patId ]: undefined },
		},
		blocks = Object.entries( this.get.blocks() ).reduce( ( blocks, [ blcId, blc ] ) => {
			if ( blc.pattern === patId ) {
				blocks[ blcId ] = undefined;
			}
			return blocks;
		}, {} );

	if ( GSData.isntEmpty( blocks ) ) {
		obj.blocks = blocks;
	}
	if ( patId === this.get.patternKeysOpened() ) {
		if ( !Object.entries( this.get.patterns() ).some( ( [ k, v ] ) => {
			if ( k !== patId && v.synth === pat.synth ) {
				obj.patternKeysOpened = k;
				return true;
			}
		} ) ) {
			obj.patternKeysOpened = null;
		}
	}
	return obj;
};
