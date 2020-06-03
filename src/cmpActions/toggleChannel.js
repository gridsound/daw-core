"use strict";

DAWCore.actions.toggleChannel = ( id, get ) => {
	const chan = get.channel( id ),
		toggle = !chan.toggle;

	return [
		{ channels: { [ id ]: { toggle } } },
		[ "mixer", "toggleChannel", chan.name, toggle ],
	];
};
