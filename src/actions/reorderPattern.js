"use strict";

DAWCore.actions.set( "reorderPattern", ( daw, patId, patterns ) => {
	const pat = daw.$getPattern( patId );

	return [
		{ patterns },
		[ "patterns", "reorderPattern", pat.type, pat.name ],
	];
} );
