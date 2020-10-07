"use strict";

DAWCore.actions.redirectKey = ( patId, keyId, destKeyId, get ) => {
	const pat = get.pattern( patId ),
		key = get.keys( pat.keys )[ keyId ],
		keys = {};

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
};
