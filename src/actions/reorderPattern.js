"use strict";

DAWCore.actions.reorderPattern = ( patId, patterns, get ) => {
	const pat = get.pattern( patId );

	return [
		{ patterns },
		[ "patterns", "reorderPattern", pat.type, pat.name ],
	];
};
