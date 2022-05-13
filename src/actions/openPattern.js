"use strict";

DAWCore.actions.set( "openPattern", ( id, _get, daw ) => {
	const pat = daw.get.pattern( id );

	if ( id !== daw.$getOpened( pat.type ) && pat.type !== "buffer" ) {
		const obj = { [ DAWCore.actionsCommon.patternOpenedByType[ pat.type ] ]: id };

		if ( pat.type === "keys" && pat.synth !== daw.$getOpened( "synth" ) ) {
			obj.synthOpened = pat.synth;
		}
		return obj;
	}
} );
