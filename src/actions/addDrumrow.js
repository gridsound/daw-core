"use strict";

DAWCore.actions.set( "addDrumrow", ( daw, pattern ) => {
	const pat = daw.$getPattern( pattern );

	if ( pat.type === "buffer" ) {
		const drumrows = daw.$getDrumrows();
		const id = DAWCore.actionsCommon.getNextIdOf( drumrows );
		const order = DAWCore.actionsCommon.getNextOrderOf( drumrows );
		const rowObj = DAWCore.json.drumrow( { pattern, order } );

		return [
			{ drumrows: { [ id ]: rowObj } },
			[ "drumrows", "addDrumrow", pat.name ],
		];
	}
} );
