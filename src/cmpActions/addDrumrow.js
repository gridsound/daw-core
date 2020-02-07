"use strict";

DAWCore.actions.addDrumrow = ( pattern, get ) => {
	const pat = get.pattern( pattern );

	if ( pat.type === "buffer" ) {
		const drumrows = get.drumrows(),
			rowId = DAWCore.common.getNextIdOf( drumrows ),
			rowObj = {
				order: DAWCore.common.getNextOrderOf( drumrows ),
				toggle: true,
				pattern,
				gain: 1,
				pan: 0,
			};

		return [
			{ drumrows: { [ rowId ]: rowObj } },
			[ "drumrows", "addDrumrow", pat.name ],
		];
	}
};
