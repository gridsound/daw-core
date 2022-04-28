"use strict";

DAWCore.actions.set( "reorderOscillator", ( synthId, oscillators, get ) => {
	return [
		{ synths: { [ synthId ]: { oscillators } } },
		[ "synth", "reorderOscillator", get.synth( synthId ).name ],
	];
} );
