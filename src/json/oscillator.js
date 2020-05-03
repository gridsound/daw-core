"use strict";

DAWCore.json.oscillator = obj => ( {
	order: 0,
	type: "sine",
	pan: 0,
	gain: 1,
	detune: 0,
	...obj,
} );
