"use strict";

DAWCore.actions.set( "removeOscillator", ( daw, synthId, id ) => {
	return [
		{ synths: { [ synthId ]: { oscillators: { [ id ]: undefined } } } },
		[ "synth", "removeOscillator", daw.$getSynth( synthId ).name ],
	];
} );
