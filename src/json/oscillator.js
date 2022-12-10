"use strict";

DAWCoreJSON.oscillator = obj => Object.assign( Object.seal( {
	order: 0,
	type: "sine",
	pan: 0,
	gain: 1,
	detune: 0,
	detunefine: 0,
} ), obj );
