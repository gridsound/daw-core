"use strict";

DAWCore.actions.openSynth = ( id, get ) => {
	if ( id !== get.opened( "synth" ) ) {
		const pat = Object.entries( get.patterns() ).find( kv => kv[ 1 ].synth === id ),
			patId = pat ? pat[ 0 ] : null,
			obj = { synthOpened: id };

		if ( patId !== get.opened( "keys" ) ) {
			obj.patternKeysOpened = patId;
		}
		return obj;
	}
};
