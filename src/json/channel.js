"use strict";

DAWCore.json.channel = obj => Object.assign( Object.seal( {
	order: 0,
	toggle: true,
	name: "chan",
	dest: "main",
	gain: 1,
	pan: 0,
} ), obj );
