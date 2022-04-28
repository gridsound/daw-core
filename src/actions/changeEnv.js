"use strict";

DAWCore.actions.set( "changeEnv", ( synthId, prop, val, get ) => {
	return [
		{ synths: { [ synthId ]: { env: { [ prop ]: val } } } },
		[ "synth", "changeEnv", get.synth( synthId ).name, prop, val ],
	];
} );
