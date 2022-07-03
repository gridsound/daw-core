"use strict";

DAWCoreActions.set( "renameComposition", ( daw, newName ) => {
	const name = DAWCore.utils.trim2( newName );
	const oldName = daw.$getName();

	if ( name && name !== oldName ) {
		return [
			{ name },
			[ "cmp", "renameComposition", oldName, name ],
		];
	}
} );
