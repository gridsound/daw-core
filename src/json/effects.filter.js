"use strict";

DAWCore.json.effects.filter = obj => Object.assign( {
	type: "lowpass",
	Q: 5,
	gain: -20,
	detune: 0,
	frequency: 500,
}, obj );