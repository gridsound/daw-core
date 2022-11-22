"use strict";

DAWCoreJSON.effects.delay = obj => Object.assign( Object.seal( {
	time: .5,
	gain: .5,
	pan: -.5,
} ), obj );
