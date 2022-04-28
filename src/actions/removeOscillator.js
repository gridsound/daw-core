"use strict";

DAWCore.actions.set( "removeOscillator", ( synthId, id, get ) => {
	return [
		{ synths: { [ synthId ]: { oscillators: { [ id ]: undefined } } } },
		[ "synth", "removeOscillator", get.synth( synthId ).name ],
	];
} );
