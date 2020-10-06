"use strict";

DAWCore.actions.changeKeysProps = ( patId, prop, arr, get ) => {
	const pat = get.pattern( patId ),
		obj = arr.reduce( ( obj, [ keyId, val ] ) => {
			obj[ keyId ] = { [ prop ]: val };
			return obj;
		}, {} );

	return [
		{ keys: { [ pat.keys ]: obj } },
		[ "keys", "changeKeysProps", pat.name, prop, arr.length ],
	];
};
