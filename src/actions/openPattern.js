"use strict";

DAWCore.actions.openPattern = ( id, get ) => {
	const pat = get.pattern( id );

	if ( id !== get.opened( pat.type ) && pat.type !== "buffer" ) {
		const obj = { [ DAWCore.actions.common.patternOpenedByType[ pat.type ] ]: id };

		if ( pat.type === "keys" && pat.synth !== get.opened( "synth" ) ) {
			obj.synthOpened = pat.synth;
		}
		return obj;
	}
};
