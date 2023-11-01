"use strict";

DAWCoreJSON.synth = obj => Object.assign( Object.seal( {
	name: "synth",
	dest: "main",
	env: DAWCoreJSON.env(),
	lfo: DAWCoreJSON.lfo(),
	oscillators: {},
} ), obj );
