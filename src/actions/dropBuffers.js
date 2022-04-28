"use strict";

DAWCore.actions.set( "dropBuffers", obj => {
	return [
		obj,
		[ "patterns", "dropBuffers", Object.keys( obj.patterns ).length ],
	];
} );
