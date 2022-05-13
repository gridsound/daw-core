"use strict";

DAWCore.actions.set( "dropBuffers", ( _daw, obj ) => {
	return [
		obj,
		[ "patterns", "dropBuffers", Object.keys( obj.patterns ).length ],
	];
} );
