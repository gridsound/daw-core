"use strict";

DAWCore.actions.reorderChannel = ( chanId, channels, get ) => {
	return [
		{ channels },
		[ "channels", "reorderChannel", get.channel( chanId ).name ],
	];
};
