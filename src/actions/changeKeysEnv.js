"use strict";

DAWCore.actions.changeKeysEnv = ( patId, keyIds, prop, incr, get ) => {
	const pat = get.pattern( patId ),
		keys = get.keys( pat.keys ),
		keysObj = keyIds.reduce( ( obj, id ) => {
			obj[ id ] = { [ prop ]: +( keys[ id ][ prop ] + incr ).toFixed( 3 ) };
			return obj;
		}, {} );

	return [
		{ keys: { [ pat.keys ]: keysObj } },
		[ "keys", "changeKeysEnv", pat.name, keyIds.length, prop ],
	];
};
