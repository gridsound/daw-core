"use strict";

DAWCore.json.lfo = obj => Object.assign( Object.seal( {
	toggle: false,
	type: "sine",
	delay: 0,
	attack: 1,
	speed: 1,
	amp: 1,
} ), obj );
