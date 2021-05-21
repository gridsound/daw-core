"use strict";

DAWCore.actions.addDrumrow = ( pattern, get ) => {
	const pat = get.pattern( pattern );

	if ( pat.type === "buffer" ) {
		const drumrows = get.drumrows(),
			id = DAWCore.actions.common.getNextIdOf( drumrows ),
			order = DAWCore.actions.common.getNextOrderOf( drumrows ),
			rowObj = DAWCore.json.drumrow( { pattern, order } );

		return [
			{ drumrows: { [ id ]: rowObj } },
			[ "drumrows", "addDrumrow", pat.name ],
		];
	}
};
