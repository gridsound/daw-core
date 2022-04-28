"use strict";

DAWCore.actions.set( "reorderPattern", ( patId, patterns, get ) => {
	const pat = get.pattern( patId );

	return [
		{ patterns },
		[ "patterns", "reorderPattern", pat.type, pat.name ],
	];
} );
