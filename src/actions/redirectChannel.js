"use strict";

DAWCore.actions.set( "redirectChannel", ( daw, id, dest ) => {
	if ( id !== "main" && id !== dest ) {
		return [
			{ channels: { [ id ]: { dest } } },
			[ "channels", "redirectChannel", daw.$getChannel( id ).name, daw.$getChannel( dest ).name ],
		];
	}
} );
