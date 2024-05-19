"use strict";

function DAWCoreJSON_channelMain( obj ) {
	return Object.assign( Object.seal( {
		toggle: true,
		name: "main",
		gain: .4,
		pan: 0,
	} ), obj );
}
