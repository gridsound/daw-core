"use strict";

DAWCore.actions.set( "redirectPatternKeys", ( patId, synthId, patterns, get ) => {
	const obj = { patterns };

	if ( patId === get.opened( "keys" ) ) {
		obj.synthOpened = synthId;
	}
	return [
		obj,
		[ "patterns", "redirectPatternKeys", get.pattern( patId ).name, get.synth( synthId ).name ],
	];
} );
