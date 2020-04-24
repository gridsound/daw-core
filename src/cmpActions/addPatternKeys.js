"use strict";

DAWCore.actions.addPatternKeys = ( synthId, get ) => {
	const pats = get.patterns(),
		keysId = DAWCore.common.getNextIdOf( get.keys() ),
		patId = DAWCore.common.getNextIdOf( pats ),
		patName = DAWCore.common.createUniqueName( "patterns", "keys", get ),
		synName = get.synth( synthId ).name,
		order = Object.values( pats ).reduce( ( max, pat ) => {
			return pat.synth !== synthId
				? max
				: Math.max( max, pat.order );
		}, -1 ) + 1,
		obj = {
			keys: { [ keysId ]: {} },
			patterns: { [ patId ]: {
				order,
				type: "keys",
				name: patName,
				keys: keysId,
				synth: synthId,
				duration: get.beatsPerMeasure(),
			} },
			patternKeysOpened: patId,
		};

	if ( synthId !== get.synthOpened() ) {
		obj.synthOpened = synthId;
	}
	return [
		obj,
		[ "patterns", "addPatternKeys", patName, synName ],
	];
};
