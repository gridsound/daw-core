"use strict";

DAWCoreActions.set( "removeOscillator", ( daw, synthId, id ) => {
	return [
		{ synths: { [ synthId ]: { oscillators: { [ id ]: undefined } } } },
		[ "synth", "removeOscillator", daw.$getSynth( synthId ).name ],
	];
} );
