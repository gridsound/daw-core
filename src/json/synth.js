"use strict";

DAWCore.json.synth = name => ( {
	name,
	dest: "main",
	oscillators: { 0: {
		order: 0,
		type: "sine",
		detune: 0,
		pan: 0,
		gain: 1,
	} },
} );
