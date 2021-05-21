"use strict";

DAWCore.actions.toggleSoloTrack = ( id, get ) => {
	const [ someOn, tracks ] = DAWCore.actions.common.toggleSolo( id, get.tracks() );

	return [
		{ tracks },
		[ "tracks", "toggleSoloTrack", get.track( id ).name, someOn ],
	];
};
