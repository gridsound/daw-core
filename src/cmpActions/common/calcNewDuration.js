"use strict";

DAWCore.common.calcNewDuration = ( newPatDurations, get ) => {
	const bPM = get.beatsPerMeasure(),
		dur = Object.values( get.blocks() ).reduce( ( max, blc ) => {
			const pat = newPatDurations[ blc.pattern ],
				dur = ( pat && !blc.durationEdited ? pat : blc ).duration;

			return Math.max( max, blc.when + dur );
		}, 0 );

	return Math.ceil( dur / bPM ) * bPM;
};
