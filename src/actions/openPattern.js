"use strict";

DAWCoreActions.set( "openPattern", ( daw, id ) => {
	const pat = daw.$getPattern( id );

	if ( id !== daw.$getOpened( pat.type ) && pat.type !== "buffer" ) {
		const obj = { [ DAWCoreActionsCommon.patternOpenedByType[ pat.type ] ]: id };

		if ( pat.type === "keys" && pat.synth !== daw.$getOpened( "synth" ) ) {
			obj.synthOpened = pat.synth;
		}
		return obj;
	}
} );
