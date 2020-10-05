"use strict";

DAWCore.actions.selectKeys = ( patId, keyIds, get ) => {
	const keysId = get.pattern( patId ).keys,
		keys = keyIds.reduce( ( obj, id ) => {
			obj[ id ] = { selected: true };
			return obj;
		}, {} );

	return [
		{ keys: { [ keysId ]: keys } },
		[ "keys", "selectKeys", keyIds.length ],
	];
};
