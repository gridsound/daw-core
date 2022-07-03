"use strict";

DAWCoreActions.set( "addKey", ( daw, patId, key, when, duration ) => {
	const pat = daw.$getPattern( patId );
	const keys = daw.$getKeys( pat.keys );
	const id = DAWCoreActionsCommon.getNextIdOf( keys );
	const keysObj = { [ id ]: DAWCoreJSON.key( { key, when, duration } ) };
	const patDur = DAWCoreActionsCommon.calcNewKeysDuration( daw, pat.keys, keysObj );
	const obj = { keys: { [ pat.keys ]: keysObj } };

	Object.entries( keys ).reduce( ( obj, [ id, key ] ) => {
		if ( key.selected && !( id in obj ) ) {
			obj[ id ] = { selected: false };
		}
		return obj;
	}, keysObj );
	DAWCoreActionsCommon.updatePatternDuration( daw, obj, patId, patDur );
	return [
		obj,
		[ "keys", "addKey", pat.name ],
	];
} );
