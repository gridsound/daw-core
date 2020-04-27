"use strict";

DAWCore.actions.redirectPatternKeys = ( patId, synthId, patterns, get ) => {
	const obj = { patterns },
		patName = get.pattern( patId ).name,
		synName = get.synth( synthId ).name;

	if ( patId === get.patternKeysOpened() ) {
		obj.synthOpened = synthId;
	}
	return [
		obj,
		[ "patterns", "redirectPatternKeys", patName, synName ],
	];
};
