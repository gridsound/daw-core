"use strict";

DAWCore.json.synth = name => ( {
	name,
	dest: "main",
	lfo: DAWCore.json.lfo(),
	oscillators: {
		0: { order: 0, type: "sine", detune: 0, pan: 0, gain: .75 },
		1: { order: 1, type: "sine", detune: -24, pan: 0, gain: .2 },
	},
} );
