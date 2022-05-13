"use strict";

DAWCore.actions.set( "changeKeysProps", ( daw, patId, prop, arr ) => {
	const pat = daw.$getPattern( patId );
	const obj = arr.reduce( ( obj, [ keyId, val ] ) => {
		obj[ keyId ] = { [ prop ]: val };
		return obj;
	}, {} );

	return [
		{ keys: { [ pat.keys ]: obj } },
		[ "keys", "changeKeysProps", pat.name, prop, arr.length ],
	];
} );
