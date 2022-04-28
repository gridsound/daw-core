"use strict";

DAWCore.actions.set( "toggleLFO", ( synthId, get ) => {
	const toggle = !get.synth( synthId ).lfo.toggle;

	return [
		{ synths: { [ synthId ]: { lfo: { toggle } } } },
		[ "synth", "toggleLFO", get.synth( synthId ).name, toggle ],
	];
} );
