"use strict";

DAWCore.actionsCommon.calcNewDuration = ( daw, changeObj ) => {
	const blocks = changeObj.blocks || {};
	const bPM = changeObj.beatsPerMeasure || daw.$getBeatsPerMeasure();
	const dur = Object.entries( daw.$getBlocks() ).reduce( ( max, [ id, blc ] ) => {
		const blcChange = blocks[ id ];

		if ( blcChange || !( id in blocks ) ) {
			const when = blcChange?.when ?? blc.when;
			const dur = blcChange?.duration ?? blc.duration;

			return Math.max( max, when + dur );
		}
		return max;
	}, 0 );
	const dur2 = Object.entries( blocks ).reduce( ( max, [ id, blc ] ) => {
		return blc && !daw.$getBlock( id )
			? Math.max( max, blc.when + blc.duration )
			: max;
	}, dur );

	return Math.ceil( dur2 / bPM ) * bPM;
};
