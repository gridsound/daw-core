"use strict";

function DAWCoreActions_reorderOscillator( daw, synthId, oscillators ) {
	return [
		{ synths: { [ synthId ]: { oscillators } } },
		[ "synth", "reorderOscillator", daw.$getSynth( synthId ).name ],
	];
}
