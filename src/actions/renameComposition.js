"use strict";

function DAWCoreActions_renameComposition( daw, newName ) {
	const name = GSUtrim2( newName );
	const oldName = daw.$getName();

	if ( name && name !== oldName ) {
		return [
			{ name },
			[ "cmp", "renameComposition", oldName, name ],
		];
	}
}
