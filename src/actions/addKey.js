"use strict";

DAWCore.actions.set( "addKey", ( patId, key, when, duration, _get, daw ) => {
	const pat = daw.get.pattern( patId );
	const keys = daw.get.keys( pat.keys );
	const id = DAWCore.actionsCommon.getNextIdOf( keys );
	const keysObj = { [ id ]: DAWCore.json.key( { key, when, duration } ) };
	const patDur = DAWCore.actionsCommon.calcNewKeysDuration( pat.keys, keysObj, daw );
	const obj = { keys: { [ pat.keys ]: keysObj } };

	Object.entries( keys ).reduce( ( obj, [ id, key ] ) => {
		if ( key.selected && !( id in obj ) ) {
			obj[ id ] = { selected: false };
		}
		return obj;
	}, keysObj );
	DAWCore.actionsCommon.updatePatternDuration( obj, patId, patDur, daw );
	return [
		obj,
		[ "keys", "addKey", pat.name ],
	];
} );
