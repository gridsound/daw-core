"use strict";

function DAWCoreJSON_drum( obj ) {
	return Object.assign( Object.seal( {
		when: 0,
		row: null,
		detune: 0,
		gain: .8,
		pan: 0,
	} ), obj );
}
