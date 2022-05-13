"use strict";

DAWCore.actions.set( "toggleChannel", ( daw, id ) => {
	const chan = daw.get.channel( id );
	const toggle = !chan.toggle;

	return [
		{ channels: { [ id ]: { toggle } } },
		[ "channels", "toggleChannel", chan.name, toggle ],
	];
} );
