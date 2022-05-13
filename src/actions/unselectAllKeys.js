"use strict";

DAWCore.actions.set( "unselectAllKeys", ( daw, patId ) => {
	let len = 0;
	const pat = daw.get.pattern( patId );
	const keysObj = Object.entries( daw.get.keys( pat.keys ) ).reduce( ( obj, [ id, key ] ) => {
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
