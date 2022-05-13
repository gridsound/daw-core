"use strict";

DAWCore.actions.set( "toggleEnv", ( daw, synthId ) => {
	const toggle = !daw.get.synth( synthId ).env.toggle;

	return [
		{ synths: { [ synthId ]: { env: { toggle } } } },
		[ "synth", "toggleEnv", daw.get.synth( synthId ).name, toggle ],
	];
} );
