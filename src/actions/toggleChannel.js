"use strict";

function DAWCoreActions_toggleChannel( daw, id ) {
	const chan = daw.$getChannel( id );
	const toggle = !chan.toggle;

	return [
		{ channels: { [ id ]: { toggle } } },
		[ "channels", "toggleChannel", chan.name, toggle ],
	];
}
