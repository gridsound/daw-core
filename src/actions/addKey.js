"use strict";

DAWCore.actions.addKey = ( patId, key, when, duration, get ) => {
	const pat = get.pattern( patId ),
		id = DAWCore.common.getNextIdOf( get.keys( pat.keys ) ),
		keys = { [ id ]: DAWCore.json.key( { key, when, duration } ) },
		patDur = DAWCore.common.calcNewKeysDuration( pat.keys, keys, get ),
		obj = { keys: { [ pat.keys ]: keys } };

	DAWCore.common.updatePatternDuration( obj, patId, patDur, get );
	return [
		obj,
		[ "keys", "addKey", pat.name ],
	];
};
