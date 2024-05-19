"use strict";

function DAWCoreActions_removeOscillator( daw, synthId, id ) {
	return [
		{ synths: { [ synthId ]: { oscillators: { [ id ]: undefined } } } },
		[ "synth", "removeOscillator", daw.$getSynth( synthId ).name ],
	];
}
