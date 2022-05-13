"use strict";

DAWCore.actions.set( "toggleSoloTrack", ( daw, id ) => {
	const [ someOn, tracks ] = DAWCore.actionsCommon.toggleSolo( id, daw.$getTracks() );

	return [
		{ tracks },
		[ "tracks", "toggleSoloTrack", daw.$getTrack( id ).name, someOn ],
	];
} );
