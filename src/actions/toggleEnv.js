"use strict";

DAWCore.actions.toggleEnv = ( synthId, get ) => {
	const toggle = !get.synth( synthId ).env.toggle;

	return [
		{ synths: { [ synthId ]: { env: { toggle } } } },
		[ "synth", "toggleEnv", get.synth( synthId ).name, toggle ],
	];
};
