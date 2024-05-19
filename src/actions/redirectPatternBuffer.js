"use strict";

function DAWCoreActions_redirectPatternBuffer( daw, id, dest ) {
	return [
		{ patterns: { [ id ]: { dest } } },
		[ "patterns", "redirectPatternBuffer", daw.$getPattern( id ).name, daw.$getChannel( dest ).name ],
	];
}
