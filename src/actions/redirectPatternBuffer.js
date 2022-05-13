"use strict";

DAWCore.actions.set( "redirectPatternBuffer", ( daw, id, dest ) => {
	return [
		{ patterns: { [ id ]: { dest } } },
		[ "patterns", "redirectPatternBuffer", daw.get.pattern( id ).name, daw.get.channel( dest ).name ],
	];
} );
