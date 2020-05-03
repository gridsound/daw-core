"use strict";

DAWCore.json.effects.filter = obj => ( {
	type: "lowpass",
	Q: 5,
	gain: -20,
	detune: 0,
	frequency: 500,
	...obj,
} );
