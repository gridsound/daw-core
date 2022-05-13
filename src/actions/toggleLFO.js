"use strict";

DAWCore.actions.set( "toggleLFO", ( daw, synthId ) => {
	const toggle = !daw.get.synth( synthId ).lfo.toggle;

	return [
		{ synths: { [ synthId ]: { lfo: { toggle } } } },
		[ "synth", "toggleLFO", daw.get.synth( synthId ).name, toggle ],
	];
} );
