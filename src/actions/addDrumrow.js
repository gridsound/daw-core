"use strict";

DAWCoreActions.set( "addDrumrow", ( daw, pattern ) => {
	const pat = daw.$getPattern( pattern );

	if ( pat.type === "buffer" ) {
		const drumrows = daw.$getDrumrows();
		const id = DAWCoreActionsCommon.getNextIdOf( drumrows );
		const order = DAWCoreActionsCommon.getNextOrderOf( drumrows );
		const rowObj = DAWCoreJSON.drumrow( { pattern, order } );

		return [
			{ drumrows: { [ id ]: rowObj } },
			[ "drumrows", "addDrumrow", pat.name ],
		];
	}
} );
