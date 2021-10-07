"use strict";

DAWCore.actions.openPattern = ( patId, get ) => {
	const pat = get.pattern( patId );

	switch ( pat.type ) {
		case "slices":
			if ( patId !== get.patternSlicesOpened() ) {
				return { patternSlicesOpened: patId };
			}
			break;
		case "drums":
			if ( patId !== get.patternDrumsOpened() ) {
				return { patternDrumsOpened: patId };
			}
			break;
		case "keys":
			if ( patId !== get.patternKeysOpened() ) {
				const obj = { patternKeysOpened: patId };

				if ( pat.synth !== get.synthOpened() ) {
					obj.synthOpened = pat.synth;
				}
				return obj;
			}
			break;
	}
};
