"use strict";

DAWCore.actions.changeEnv = ( synthId, prop, val, get ) => {
	return [
		{ synths: { [ synthId ]: { env: { [ prop ]: val } } } },
		[ "synth", "changeEnv", get.synth( synthId ).name, prop, val ],
	];
};
