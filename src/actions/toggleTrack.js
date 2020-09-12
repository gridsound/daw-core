"use strict";

DAWCore.actions.toggleTrack = ( id, get ) => {
	const track = get.track( id ),
		toggle = !track.toggle;

	return [
		{ tracks: { [ id ]: { toggle } } },
		[ "tracks", "toggleTrack", track.name, toggle ],
	];
};
