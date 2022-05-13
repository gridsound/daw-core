"use strict";

DAWCore.actions.set( "redirectPatternSlices", ( daw, patId, source ) => {
	if ( source !== daw.get.pattern( patId ).source ) {
		return [
			{ patterns: { [ patId ]: { source } } },
			[ "patterns", "redirectPatternSlices", daw.get.pattern( patId ).name, daw.get.pattern( source ).name ],
		];
	}
} );
