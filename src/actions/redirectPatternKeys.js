"use strict";

DAWCore.actions.set( "redirectPatternKeys", ( patId, synthId, patterns, _get, daw ) => {
	const obj = { patterns };

	if ( patId === daw.$getOpened( "keys" ) ) {
		obj.synthOpened = synthId;
	}
	return [
		obj,
		[ "patterns", "redirectPatternKeys", daw.get.pattern( patId ).name, daw.get.synth( synthId ).name ],
	];
} );
