"use strict";

DAWCore.actions.addKey = ( patId, key, when, duration, get ) => {
	const pat = get.pattern( patId ),
		keys = get.keys( pat.keys ),
		id = DAWCore.actions.common.getNextIdOf( keys ),
		keysObj = { [ id ]: DAWCore.json.key( { key, when, duration } ) },
		patDur = DAWCore.actions.common.calcNewKeysDuration( pat.keys, keysObj, get ),
		obj = { keys: { [ pat.keys ]: keysObj } };

	Object.entries( keys ).reduce( ( obj, [ id, key ] ) => {
		if ( key.selected && !( id in obj ) ) {
			obj[ id ] = { selected: false };
		}
		return obj;
	}, keysObj );
	DAWCore.actions.common.updatePatternDuration( obj, patId, patDur, get );
	return [
		obj,
		[ "keys", "addKey", pat.name ],
	];
};
