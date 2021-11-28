"use strict";

DAWCore.actions.dropBuffers = ( obj, get ) => {
	return [
		obj,
		[ "patterns", "dropBuffers", Object.keys( obj.patterns ).length ],
	];
};
