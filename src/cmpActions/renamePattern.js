"use strict";

DAWCore.actions.renamePattern = ( id, newName, get ) => {
	const name = GSUtils.trim2( newName ),
		pat = get.pattern( id );

	if ( name && name !== pat.name ) {
		return [
			{ patterns: { [ id ]: { name } } },
			[ "patterns", "renamePattern", pat.type, pat.name, name ],
		];
	}
};
