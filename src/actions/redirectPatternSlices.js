"use strict";

DAWCore.actions.set( "redirectPatternSlices", ( patId, source, get ) => {
	if ( source !== get.pattern( patId ).source ) {
		return [
			{ patterns: { [ patId ]: { source } } },
			[ "patterns", "redirectPatternSlices", get.pattern( patId ).name, get.pattern( source ).name ],
		];
	}
} );
