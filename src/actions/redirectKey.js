"use strict";

DAWCore.actions.set( "redirectKey", ( daw, patId, keyId, destKeyId ) => {
	const pat = daw.$getPattern( patId );
	const key = daw.$getKeys( pat.keys )[ keyId ];
	const keys = {};

	if ( destKeyId ) {
		keys[ keyId ] = { next: destKeyId };
		keys[ destKeyId ] = { prev: keyId };
		if ( key.next ) {
			keys[ key.next ] = { prev: null };
		}
	} else {
		keys[ keyId ] = { next: null };
		keys[ key.next ] = { prev: null };
	}
	return [
		{ keys: { [ pat.keys ]: keys } },
		[ "keys", "redirectKey", pat.name, !!destKeyId ],
	];
} );
