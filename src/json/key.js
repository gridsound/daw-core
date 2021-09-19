"use strict";

DAWCore.json.key = obj => Object.assign( Object.seal( {
	prev: null,
	next: null,
	key: 57,
	when: 0,
	duration: 1,
	gain: .8,
	gainLFOAmp: 1,
	gainLFOSpeed: 1,
	pan: 0,
	highpass: 1,
	lowpass: 1,
	selected: false,
} ), obj );
