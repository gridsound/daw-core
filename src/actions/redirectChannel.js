"use strict";

DAWCore.actions.set( "redirectChannel", ( id, dest, get ) => {
	if ( id !== "main" && id !== dest ) {
		return [
			{ channels: { [ id ]: { dest } } },
			[ "channels", "redirectChannel", get.channel( id ).name, get.channel( dest ).name ],
		];
	}
} );
