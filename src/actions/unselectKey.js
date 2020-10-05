"use strict";

DAWCore.actions.unselectKey = ( patId, keyId, get ) => {
	const keysId = get.pattern( patId ).keys;

	return [
		{ keys: { [ keysId ]: { [ keyId ]: { selected: false } } } },
		[ "keys", "unselectKey" ],
	];
};
