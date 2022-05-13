"use strict";

DAWCore.actions.set( "changeLFO", ( daw, synthId, prop, val ) => {
	return [
		{ synths: { [ synthId ]: { lfo: { [ prop ]: val } } } },
		[ "synth", "changeLFO", daw.get.synth( synthId ).name, prop, val ],
	];
} );
