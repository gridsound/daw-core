"use strict";

DAWCore.actions.addDrumrow = ( pattern, get ) => {
	const pat = get.pattern( pattern );

	if ( pat.type === "buffer" ) {
		const drumrows = get.drumrows();
		const id = DAWCore.actions.common.getNextIdOf( drumrows );
		const order = DAWCore.actions.common.getNextOrderOf( drumrows );
		const rowObj = DAWCore.json.drumrow( { pattern, order } );

		return [
			{ drumrows: { [ id ]: rowObj } },
			[ "drumrows", "addDrumrow", pat.name ],
		];
	}
};
