"use strict";

DAWCore.actions.redirectPatternKeys = ( patId, synthId, patterns, get ) => {
	const obj = { patterns };

	if ( patId === get.patternKeysOpened() ) {
		obj.synthOpened = synthId;
	}
	return [
		obj,
		[ "patterns", "redirectPatternKeys", get.pattern( patId ).name, get.synth( synthId ).name ],
	];
};
