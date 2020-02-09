"use strict";

DAWCore.actions.reorderOscillator = ( synthId, oscillators, get ) => {
	return [
		{ synths: { [ synthId ]: { oscillators } } },
		[ "synth", "reorderOscillator", get.synth( synthId ).name ],
	];
};
