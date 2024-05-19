"use strict";

function DAWCoreJSON_effects_filter( obj ) {
	return Object.assign( Object.seal( {
		type: "lowpass",
		Q: 5,
		gain: -20,
		detune: 0,
		frequency: 500,
	} ), obj );
}
