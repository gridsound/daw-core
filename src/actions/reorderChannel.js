"use strict";

DAWCoreActions.set( "reorderChannel", ( daw, chanId, channels ) => {
	return [
		{ channels },
		[ "channels", "reorderChannel", daw.$getChannel( chanId ).name ],
	];
} );
