"use strict";

DAWCore.actions.toggleChannel = ( id, get ) => {
	const chan = get.channel( id ),
		toggle = !chan.toggle;

	return [
		{ channels: { [ id ]: { toggle } } },
		[ "channels", "toggleChannel", chan.name, toggle ],
	];
};
