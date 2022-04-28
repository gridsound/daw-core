"use strict";

DAWCore.actions.addDrumrow = ( pattern, get ) => {
	const pat = get.pattern( pattern );

	if ( pat.type === "buffer" ) {
		const drumrows = get.drumrows();
		const id = DAWCore.actionsCommon.getNextIdOf( drumrows );
		const order = DAWCore.actionsCommon.getNextOrderOf( drumrows );
		const rowObj = DAWCore.json.drumrow( { pattern, order } );

		return [
			{ drumrows: { [ id ]: rowObj } },
			[ "drumrows", "addDrumrow", pat.name ],
		];
	}
};
