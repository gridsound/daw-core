"use strict";

DAWCore.actions.dropBuffers = obj => {
	return [
		obj,
		[ "patterns", "dropBuffers", Object.keys( obj.patterns ).length ],
	];
};
