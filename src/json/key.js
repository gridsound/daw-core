"use strict";

DAWCore.json.key = obj => ( {
	prev: null,
	next: null,
	key: 57,
	when: 0,
	duration: 1,
	gain: .8,
	pan: 0,
	highpass: 1,
	lowpass: 1,
	attack: 0,
	release: 0,
	selected: false,
	lfoSpeed: 1,
	...obj,
} );
