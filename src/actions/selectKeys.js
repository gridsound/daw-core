"use strict";

DAWCore.actions.set( "selectKeys", ( patId, keyIds, get ) => {
	const pat = get.pattern( patId );
	const keys = keyIds.reduce( ( obj, id ) => {
		obj[ id ] = { selected: true };
		return obj;
	}, {} );

	return [
		{ keys: { [ pat.keys ]: keys } },
		[ "keys", "selectKeys", pat.name, keyIds.length ],
	];
} );
