"use strict";

DAWCore.actions.set( "redirectPatternBuffer", ( daw, id, dest ) => {
	return [
		{ patterns: { [ id ]: { dest } } },
		[ "patterns", "redirectPatternBuffer", daw.$getPattern( id ).name, daw.$getChannel( dest ).name ],
	];
} );
