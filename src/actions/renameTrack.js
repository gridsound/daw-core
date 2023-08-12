"use strict";

DAWCoreActions.set( "renameTrack", ( daw, id, newName ) => {
	const name = GSUtrim2( newName );
	const tr = daw.$getTrack( id );

	if ( name !== tr.name ) {
		return [
			{ tracks: { [ id ]: { name } } },
			[ "tracks", "renameTrack", tr.name, name ],
		];
	}
} );
