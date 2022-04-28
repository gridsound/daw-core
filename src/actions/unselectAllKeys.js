"use strict";

DAWCore.actions.set( "unselectAllKeys", ( patId, get ) => {
	let len = 0;
	const pat = get.pattern( patId );
	const keysObj = Object.entries( get.keys( pat.keys ) ).reduce( ( obj, [ id, key ] ) => {
		if ( key.selected ) {
			++len;
			obj[ id ] = { selected: false };
		}
		return obj;
	}, {} );

	return [
		{ keys: { [ pat.keys ]: keysObj } },
		[ "keys", "unselectAllKeys", pat.name, len ],
	];
} );
