"use strict";

DAWCore.actions.set( "toggleEnv", ( synthId, get ) => {
	const toggle = !get.synth( synthId ).env.toggle;

	return [
		{ synths: { [ synthId ]: { env: { toggle } } } },
		[ "synth", "toggleEnv", get.synth( synthId ).name, toggle ],
	];
} );
