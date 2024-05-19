"use strict";

function DAWCoreActions_changeOscillator( daw, synthId, oscId, prop, val ) {
	return [
		{ synths: { [ synthId ]: { oscillators: { [ oscId ]: { [ prop ]: val } } } } },
		[ "synth", "changeOscillator", daw.$getSynth( synthId ).name, prop, val ],
	];
}
