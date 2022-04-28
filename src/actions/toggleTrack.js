"use strict";

DAWCore.actions.set( "toggleTrack", ( id, get ) => {
	const track = get.track( id );
	const toggle = !track.toggle;

	return [
		{ tracks: { [ id ]: { toggle } } },
		[ "tracks", "toggleTrack", track.name, toggle ],
	];
} );
