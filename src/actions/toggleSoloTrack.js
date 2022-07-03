"use strict";

DAWCoreActions.set( "toggleSoloTrack", ( daw, id ) => {
	const [ someOn, tracks ] = DAWCoreActionsCommon.toggleSolo( id, daw.$getTracks() );

	return [
		{ tracks },
		[ "tracks", "toggleSoloTrack", daw.$getTrack( id ).name, someOn ],
	];
} );
