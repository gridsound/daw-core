"use strict";

DAWCore.actions.set( "changeOscillator", ( synthId, oscId, prop, val, get ) => {
	return [
		{ synths: { [ synthId ]: { oscillators: { [ oscId ]: { [ prop ]: val } } } } },
		[ "synth", "changeOscillator", get.synth( synthId ).name, prop, val ],
	];
} );
