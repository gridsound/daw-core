"use strict";

DAWCore.actions.set( "openSynth", ( daw, id ) => {
	if ( id !== daw.$getOpened( "synth" ) ) {
		const pat = Object.entries( daw.$getPatterns() ).find( kv => kv[ 1 ].synth === id );
		const patId = pat ? pat[ 0 ] : null;
		const obj = { synthOpened: id };

		if ( patId !== daw.$getOpened( "keys" ) ) {
			obj.patternKeysOpened = patId;
		}
		return obj;
	}
} );
