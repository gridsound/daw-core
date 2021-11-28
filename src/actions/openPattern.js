"use strict";

DAWCore.actions.openPattern = ( id, get ) => {
	const pat = get.pattern( id ),
		attr = DAWCore.actions.common.patternOpenedByType[ pat.type ];

	if ( id !== get[ attr ]() && pat.type !== "buffer" ) {
		const obj = { [ attr ]: id }

		if ( pat.type === "keys" && pat.synth !== get.synthOpened() ) {
			obj.synthOpened = pat.synth;
		}
		return obj;
	}
};
