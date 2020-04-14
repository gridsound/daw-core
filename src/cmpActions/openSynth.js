"use strict";

DAWCore.actions.openSynth = ( id, get ) => {
	if ( id !== get.synthOpened() ) {
		const pat = Object.entries( get.patterns() ).find( kv => kv[ 1 ].synth === id ),
			patId = pat ? pat[ 0 ] : null,
			obj = { synthOpened: id };

		if ( patId !== get.patternKeysOpened() ) {
			obj.patternKeysOpened = patId;
		}
		return obj;
	}
};
