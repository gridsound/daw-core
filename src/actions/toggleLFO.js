"use strict";

function DAWCoreActions_toggleLFO( daw, synthId ) {
	const toggle = !daw.$getSynth( synthId ).lfo.toggle;

	return [
		{ synths: { [ synthId ]: { lfo: { toggle } } } },
		[ "synth", "toggleLFO", daw.$getSynth( synthId ).name, toggle ],
	];
}
