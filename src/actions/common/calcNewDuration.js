"use strict";

DAWCore.actions.common.calcNewDuration = ( changeObj, get ) => {
	const blocks = changeObj.blocks || {};
	const bPM = changeObj.beatsPerMeasure || get.beatsPerMeasure();
	const dur = Object.entries( get.blocks() ).reduce( ( max, [ id, blc ] ) => {
		const blcChange = blocks[ id ];

		if ( blcChange || !( id in blocks ) ) {
			const when = blcChange?.when ?? blc.when;
			const dur = blcChange?.duration ?? blc.duration;

			return Math.max( max, when + dur );
		}
		return max;
	}, 0 );
	const dur2 = Object.entries( blocks ).reduce( ( max, [ id, blc ] ) => {
		return blc && !get.block( id )
			? Math.max( max, blc.when + blc.duration )
			: max;
	}, dur );

	return Math.ceil( dur2 / bPM ) * bPM;
};
