"use strict";

DAWCore.actions.set( "reorderChannel", ( chanId, channels, get ) => {
	return [
		{ channels },
		[ "channels", "reorderChannel", get.channel( chanId ).name ],
	];
} );
