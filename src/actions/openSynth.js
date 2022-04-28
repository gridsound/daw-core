"use strict";

DAWCore.actions.set( "openSynth", ( id, get ) => {
	if ( id !== get.opened( "synth" ) ) {
		const pat = Object.entries( get.patterns() ).find( kv => kv[ 1 ].synth === id );
		const patId = pat ? pat[ 0 ] : null;
		const obj = { synthOpened: id };

		if ( patId !== get.opened( "keys" ) ) {
			obj.patternKeysOpened = patId;
		}
		return obj;
	}
} );
