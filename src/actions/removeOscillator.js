"use strict";

DAWCore.actions.set( "removeOscillator", ( daw, synthId, id ) => {
	return [
		{ synths: { [ synthId ]: { oscillators: { [ id ]: undefined } } } },
		[ "synth", "removeOscillator", daw.get.synth( synthId ).name ],
	];
} );
