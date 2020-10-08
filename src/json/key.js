"use strict";

DAWCore.json.key = obj => ( {
	key: 57,
	when: 1,
	duration: 1,
	gain: .8,
	pan: 0,
	highpass: 1,
	lowpass: 1,
	attack: 0,
	release: 0,
	selected: false,
	prev: null,
	next: null,
	...obj,
} );
