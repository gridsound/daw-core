"use strict";

DAWCore.actions.set( "redirectChannel", ( daw, id, dest ) => {
	if ( id !== "main" && id !== dest ) {
		return [
			{ channels: { [ id ]: { dest } } },
			[ "channels", "redirectChannel", daw.get.channel( id ).name, daw.get.channel( dest ).name ],
		];
	}
} );
