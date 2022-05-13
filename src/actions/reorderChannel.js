"use strict";

DAWCore.actions.set( "reorderChannel", ( daw, chanId, channels ) => {
	return [
		{ channels },
		[ "channels", "reorderChannel", daw.get.channel( chanId ).name ],
	];
} );
