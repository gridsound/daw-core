"use strict";

DAWCore.actions.set( "toggleEnv", ( daw, synthId ) => {
	const toggle = !daw.$getSynth( synthId ).env.toggle;

	return [
		{ synths: { [ synthId ]: { env: { toggle } } } },
		[ "synth", "toggleEnv", daw.$getSynth( synthId ).name, toggle ],
	];
} );
