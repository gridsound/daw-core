"use strict";

DAWCore.actions.set( "changeOscillator", ( daw, synthId, oscId, prop, val ) => {
	return [
		{ synths: { [ synthId ]: { oscillators: { [ oscId ]: { [ prop ]: val } } } } },
		[ "synth", "changeOscillator", daw.get.synth( synthId ).name, prop, val ],
	];
} );
