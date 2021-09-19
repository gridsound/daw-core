"use strict";

DAWCore.json.env = obj => Object.assign( Object.seal( {
	toggle: true,
	attack: .04,
	hold: 0,
	decay: .08,
	sustain: .75,
	release: .25,
} ), obj );
