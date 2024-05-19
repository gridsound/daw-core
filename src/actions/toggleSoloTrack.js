"use strict";

DAWCoreActions.toggleSoloTrack = ( daw, id ) => {
	const [ someOn, tracks ] = DAWCoreActionsCommon_toggleSolo( id, daw.$getTracks() );

	return [
		{ tracks },
		[ "tracks", "toggleSoloTrack", daw.$getTrack( id ).name, someOn ],
	];
};
