"use strict";

DAWCore.actions.set( "toggleTrack", ( daw, id ) => {
	const track = daw.$getTrack( id );
	const toggle = !track.toggle;

	return [
		{ tracks: { [ id ]: { toggle } } },
		[ "tracks", "toggleTrack", track.name, toggle ],
	];
} );
