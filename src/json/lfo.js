"use strict";

function DAWCoreJSON_lfo( obj ) {
	return Object.assign( Object.seal( {
		toggle: false,
		type: "sine",
		delay: 0,
		attack: 1,
		speed: 1,
		amp: 1,
	} ), obj );
}
