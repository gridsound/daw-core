"use strict";

DAWCore.actions.set( "renamePattern", ( id, newName, get ) => {
	const name = DAWCore.utils.trim2( newName );
	const pat = get.pattern( id );

	if ( name && name !== pat.name ) {
		return [
			{ patterns: { [ id ]: { name } } },
			[ "patterns", "renamePattern", pat.type, pat.name, name ],
		];
	}
} );
