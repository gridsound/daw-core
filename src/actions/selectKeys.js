"use strict";

function DAWCoreActions_selectKeys( daw, patId, keyIds ) {
	const pat = daw.$getPattern( patId );
	const keys = keyIds.reduce( ( obj, id ) => {
		obj[ id ] = { selected: true };
		return obj;
	}, {} );

	return [
		{ keys: { [ pat.keys ]: keys } },
		[ "keys", "selectKeys", pat.name, keyIds.length ],
	];
}
