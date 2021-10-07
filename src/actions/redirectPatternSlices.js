"use strict";

DAWCore.actions.redirectPatternSlices = ( patId, source, get ) => {
	const obj = { patterns: { [ patId ]: { source } } };

	return [
		obj,
		[ "patterns", "redirectPatternSlices", get.pattern( patId ).name, get.pattern( source ).name ],
	];
};
