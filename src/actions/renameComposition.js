"use strict";

DAWCore.actions.set( "renameComposition", ( daw, newName ) => {
	const name = DAWCore.utils.trim2( newName );
	const oldName = daw.get.name();

	if ( name && name !== oldName ) {
		return [
			{ name },
			[ "cmp", "renameComposition", oldName, name ],
		];
	}
} );
