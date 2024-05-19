"use strict";

function DAWCoreActions_reorderChannel( daw, chanId, channels ) {
	return [
		{ channels },
		[ "channels", "reorderChannel", daw.$getChannel( chanId ).name ],
	];
}
