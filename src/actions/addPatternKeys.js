"use strict";

DAWCore.actions.addPatternKeys = ( synthId, get ) => {
	const pats = get.patterns();
	const keysId = DAWCore.actions.common.getNextIdOf( get.keys() );
	const patId = DAWCore.actions.common.getNextIdOf( pats );
	const patName = DAWCore.actions.common.createUniqueName( "patterns", "keys", get );
	const synName = get.synth( synthId ).name;
	const order = Object.values( pats ).reduce( ( max, pat ) => {
		return pat.synth !== synthId
			? max
			: Math.max( max, pat.order );
	}, -1 ) + 1;
	const obj = {
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

	if ( synthId !== get.opened( "synth" ) ) {
		obj.synthOpened = synthId;
	}
	return [
		obj,
		[ "patterns", "addPatternKeys", patName, synName ],
	];
};
