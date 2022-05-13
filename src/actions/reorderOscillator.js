"use strict";

DAWCore.actions.set( "reorderOscillator", ( daw, synthId, oscillators ) => {
	return [
		{ synths: { [ synthId ]: { oscillators } } },
		[ "synth", "reorderOscillator", daw.$getSynth( synthId ).name ],
	];
} );
