"use strict";

DAWCore.prototype.newPattern = function( synthId ) {
	const pats = this.get.patterns(),
		keysId = this._getNextIdOf( this.get.keys() ),
		patId = this._getNextIdOf( pats ),
		order = Object.values( pats ).reduce( ( max, pat ) => {
			return pat.synth !== synthId
				? max
				: Math.max( max, pat.order );
		}, 0 ) + 1;

	this.compositionChange( {
		keys: { [ keysId ]: {} },
		patterns: { [ patId ]: {
			order,
			type: "keys",
			name: this._createUniqueName( "patterns", "pat" ),
			keys: keysId,
			synth: synthId,
			duration: this.get.beatsPerMeasure(),
		} },
		patternKeysOpened: patId,
	} );
};
