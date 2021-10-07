"use strict";

DAWCore.actions.openPattern = ( id, get ) => {
	const pat = get.pattern( id ),
		attr = DAWCore.actions.common.patternOpenedByType[ pat.type ],
		obj = {};

	if ( id !== get[ attr ]() ) {
		obj[ attr ] = id;
		if ( pat.type === "keys" && pat.synth !== get.synthOpened() ) {
			obj.synthOpened = pat.synth;
		}
	}
	return obj;
};
