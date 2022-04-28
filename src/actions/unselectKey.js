"use strict";

DAWCore.actions.set( "unselectKey", ( patId, keyId, get ) => {
	const pat = get.pattern( patId );

	return [
		{ keys: { [ pat.keys ]: { [ keyId ]: { selected: false } } } },
		[ "keys", "unselectKey", pat.name ],
	];
} );
