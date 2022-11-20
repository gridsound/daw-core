"use strict";

DAWCoreJSON.effects.delay = obj => Object.assign( Object.seal( {
	time: .25,
	gain: .2,
	pan: .75,
} ), obj );
