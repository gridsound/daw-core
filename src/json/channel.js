"use strict";

DAWCore.json.channel = obj => ( {
	order: 0,
	toggle: true,
	name: "chan",
	dest: "main",
	gain: 1,
	pan: 0,
	...obj,
} );
