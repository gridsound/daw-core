"use strict";

function DAWCoreJSON_drumrow( obj ) {
	return Object.assign( Object.seal( {
		order: 0,
		toggle: true,
		pattern: null,
		detune: 0,
		gain: 1,
		pan: 0,
	} ), obj );
}
