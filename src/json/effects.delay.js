"use strict";

function DAWCoreJSON_effects_delay( obj ) {
	return Object.assign( Object.seal( {
		time: .5,
		gain: .5,
		pan: -.5,
	} ), obj );
}
