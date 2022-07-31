"use strict";

DAWCoreActions.set( "renameComposition", ( daw, newName ) => {
	const name = DAWCoreUtils.$trim2( newName );
	const oldName = daw.$getName();

	if ( name && name !== oldName ) {
		return [
			{ name },
			[ "cmp", "renameComposition", oldName, name ],
		];
	}
} );
