"use strict";

DAWCore.actions.reorderChannel = ( chanId, channels, get ) => {
	return [
		{ channels },
		[ "mixer", "reorderChannel", get.channel( chanId ).name ],
	];
};
