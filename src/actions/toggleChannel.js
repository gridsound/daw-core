"use strict";

DAWCore.actions.set( "toggleChannel", ( id, get ) => {
	const chan = get.channel( id );
	const toggle = !chan.toggle;

	return [
		{ channels: { [ id ]: { toggle } } },
		[ "channels", "toggleChannel", chan.name, toggle ],
	];
} );
