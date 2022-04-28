"use strict";

DAWCore.actions.addKey = ( patId, key, when, duration, get ) => {
	const pat = get.pattern( patId );
	const keys = get.keys( pat.keys );
	const id = DAWCore.actionsCommon.getNextIdOf( keys );
	const keysObj = { [ id ]: DAWCore.json.key( { key, when, duration } ) };
	const patDur = DAWCore.actionsCommon.calcNewKeysDuration( pat.keys, keysObj, get );
	const obj = { keys: { [ pat.keys ]: keysObj } };

	Object.entries( keys ).reduce( ( obj, [ id, key ] ) => {
		if ( key.selected && !( id in obj ) ) {
			obj[ id ] = { selected: false };
		}
		return obj;
	}, keysObj );
	DAWCore.actionsCommon.updatePatternDuration( obj, patId, patDur, get );
	return [
		obj,
		[ "keys", "addKey", pat.name ],
	];
};
