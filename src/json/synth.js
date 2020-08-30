"use strict";

DAWCore.json.synth = obj => ( {
	name: "synth",
	dest: "main",
	env: DAWCore.json.env(),
	lfo: DAWCore.json.lfo(),
	oscillators: {
		0: DAWCore.json.oscillator( { gain: .75 } ),
		1: DAWCore.json.oscillator( { order: 1, gain: .2, detune: -24 } ),
	},
	...obj,
} );
