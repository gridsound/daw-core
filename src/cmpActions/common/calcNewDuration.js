"use strict";

DAWCore.common.calcNewDuration = ( changeObj, get ) => {
	const { patterns, beatsPerMeasure } = changeObj,
		bPM = beatsPerMeasure || get.beatsPerMeasure(),
		dur = Object.values( get.blocks() ).reduce( ( max, blc ) => {
			const pat = patterns[ blc.pattern ],
				dur = ( pat && !blc.durationEdited ? pat : blc ).duration;

			return Math.max( max, blc.when + dur );
		}, 0 );

	return Math.ceil( dur / bPM ) * bPM;
};
