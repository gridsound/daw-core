"use strict";

function DAWCoreJSON_synth( obj ) {
	return Object.assign( Object.seal( {
		name: "synth",
		dest: "main",
		env: DAWCoreJSON_env(),
		lfo: DAWCoreJSON_lfo(),
		oscillators: {},
	} ), obj );
}
