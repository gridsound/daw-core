"use strict";

DAWCore.actions.set( "unselectKey", ( daw, patId, keyId ) => {
	const pat = daw.$getPattern( patId );

	return [
		{ keys: { [ pat.keys ]: { [ keyId ]: { selected: false } } } },
		[ "keys", "unselectKey", pat.name ],
	];
} );
