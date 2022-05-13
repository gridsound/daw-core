"use strict";

DAWCore.actions.set( "redirectPatternKeys", ( daw, patId, synthId, patterns ) => {
	const obj = { patterns };

	if ( patId === daw.$getOpened( "keys" ) ) {
		obj.synthOpened = synthId;
	}
	return [
		obj,
		[ "patterns", "redirectPatternKeys", daw.$getPattern( patId ).name, daw.$getSynth( synthId ).name ],
	];
} );
