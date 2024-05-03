"use strict";

DAWCoreJSON.effects.waveshaper = obj => Object.assign( Object.seal( {
	symmetry: true,
	oversample: "none",
	curve: {
		0: { x: -1, y: -1 },
		1: { x:  1, y:  1 },
		2: { x:  0, y:  0 },
	},
} ), obj );
