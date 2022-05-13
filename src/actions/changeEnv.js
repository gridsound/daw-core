"use strict";

DAWCore.actions.set( "changeEnv", ( daw, synthId, prop, val ) => {
	return [
		{ synths: { [ synthId ]: { env: { [ prop ]: val } } } },
		[ "synth", "changeEnv", daw.get.synth( synthId ).name, prop, val ],
	];
} );
