"use strict";

DAWCore.actions.set( "renameChannel", ( id, newName, get ) => {
	const name = DAWCore.utils.trim2( newName );
	const chan = get.channel( id );

	if ( id !== "main" && name && name !== chan.name ) {
		return [
			{ channels: { [ id ]: { name } } },
			[ "channels", "renameChannel", chan.name, name ],
		];
	}
} );
