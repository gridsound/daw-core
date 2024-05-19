"use strict";

function DAWCoreActions_changeLFO( daw, synthId, prop, val ) {
	return [
		{ synths: { [ synthId ]: { lfo: { [ prop ]: val } } } },
		[ "synth", "changeLFO", daw.$getSynth( synthId ).name, prop, val ],
	];
}
