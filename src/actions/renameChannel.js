"use strict";

DAWCore.actions.set( "renameChannel", ( daw, id, newName ) => {
	const name = DAWCore.utils.trim2( newName );
	const chan = daw.$getChannel( id );

	if ( id !== "main" && name && name !== chan.name ) {
		return [
			{ channels: { [ id ]: { name } } },
			[ "channels", "renameChannel", chan.name, name ],
		];
	}
} );
