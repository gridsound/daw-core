"use strict";

DAWCoreJSON.synth = obj => Object.assign( Object.seal( {
	name: "synth",
	dest: "main",
	env: DAWCoreJSON.env(),
	lfo: DAWCoreJSON.lfo(),
	oscillators: {
		0: DAWCoreJSON.oscillator( { gain: .75 } ),
		1: DAWCoreJSON.oscillator( { order: 1, gain: .2, detune: -24 } ),
	},
} ), obj );
