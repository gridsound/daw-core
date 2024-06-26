"use strict";

function DAWCoreActions_changeEnv( daw, synthId, prop, val ) {
	return [
		{ synths: { [ synthId ]: { env: { [ prop ]: val } } } },
		[ "synth", "changeEnv", daw.$getSynth( synthId ).name, prop, val ],
	];
}
