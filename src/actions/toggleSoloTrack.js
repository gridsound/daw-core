"use strict";

DAWCore.actions.set( "toggleSoloTrack", ( id, get ) => {
	const [ someOn, tracks ] = DAWCore.actionsCommon.toggleSolo( id, get.tracks() );

	return [
		{ tracks },
		[ "tracks", "toggleSoloTrack", get.track( id ).name, someOn ],
	];
} );
