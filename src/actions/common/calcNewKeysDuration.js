"use strict";

DAWCore.actions.common.calcNewKeysDuration = ( keysId, keysObj, get ) => {
	const bPM = get.beatsPerMeasure();
	const keys = get.keys( keysId );
	const dur = Object.entries( keys ).reduce( ( max, [ id, key ] ) => {
		const keyChange = keysObj[ id ];

		if ( keyChange || !( id in keysObj ) ) {
			const when = keyChange?.when ?? key.when;
			const dur = keyChange?.duration ?? key.duration;

			return Math.max( max, when + dur );
		}
		return max;
	}, 0 );
	const dur2 = Object.entries( keysObj ).reduce( ( max, [ id, key ] ) => {
		return key && !keys[ id ]
			? Math.max( max, key.when + key.duration )
			: max;
	}, dur );

	return Math.max( 1, Math.ceil( dur2 / bPM ) ) * bPM;
};
