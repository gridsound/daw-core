"use strict";

DAWCoreActions.set( "renamePattern", ( daw, id, newName ) => {
	const name = DAWCoreUtils.$trim2( newName );
	const pat = daw.$getPattern( id );

	if ( name && name !== pat.name ) {
		return [
			{ patterns: { [ id ]: { name } } },
			[ "patterns", "renamePattern", pat.type, pat.name, name ],
		];
	}
} );
