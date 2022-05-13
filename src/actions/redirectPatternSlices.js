"use strict";

DAWCore.actions.set( "redirectPatternSlices", ( daw, patId, source ) => {
	if ( source !== daw.$getPattern( patId ).source ) {
		return [
			{ patterns: { [ patId ]: { source } } },
			[ "patterns", "redirectPatternSlices", daw.$getPattern( patId ).name, daw.$getPattern( source ).name ],
		];
	}
} );
