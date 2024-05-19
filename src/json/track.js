"use strict";

function DAWCoreJSON_track( obj ) {
	return Object.assign( Object.seal( {
		name: "",
		order: 0,
		toggle: true,
	} ), obj );
}
