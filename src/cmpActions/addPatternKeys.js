"use strict";

DAWCore.actions.addPatternKeys = function( synthId ) {
	const pats = this.get.patterns(),
		keysId = this._getNextIdOf( this.get.keys() ),
		patId = this._getNextIdOf( pats ),
		patName = this._createUniqueName( "patterns", "keys" ),
		synName = this.get.synth( synthId ).name,
		order = Object.values( pats ).reduce( ( max, pat ) => {
			return pat.synth !== synthId
				? max
				: Math.max( max, pat.order );
		}, 0 ) + 1,
		obj = {
			keys: { [ keysId ]: {} },
			patterns: { [ patId ]: {
				order,
				type: "keys",
				name: patName,
				keys: keysId,
				synth: synthId,
				duration: this.get.beatsPerMeasure(),
			} },
			patternKeysOpened: patId,
		};

	if ( synthId !== this.get.synthOpened() ) {
		obj.synthOpened = synthId;
	}
	return [
		obj,
		[ "patterns", "addPatternKeys", patName, synName ],
	];
};
