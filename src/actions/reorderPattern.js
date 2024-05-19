"use strict";

function DAWCoreActions_reorderPattern( daw, patId, patterns ) {
	const pat = daw.$getPattern( patId );

	return [
		{ patterns },
		[ "patterns", "reorderPattern", pat.type, pat.name ],
	];
}
