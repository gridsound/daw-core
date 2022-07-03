"use strict";

DAWCoreActions.set( "unselectKey", ( daw, patId, keyId ) => {
	const pat = daw.$getPattern( patId );

	return [
		{ keys: { [ pat.keys ]: { [ keyId ]: { selected: false } } } },
		[ "keys", "unselectKey", pat.name ],
	];
} );
