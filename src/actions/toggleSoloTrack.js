"use strict";

DAWCore.actions.set( "toggleSoloTrack", ( daw, id ) => {
	const [ someOn, tracks ] = DAWCore.actionsCommon.toggleSolo( id, daw.get.tracks() );

	return [
		{ tracks },
		[ "tracks", "toggleSoloTrack", daw.get.track( id ).name, someOn ],
	];
} );
