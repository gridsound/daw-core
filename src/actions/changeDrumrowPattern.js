"use strict";

DAWCore.actions.set( "changeDrumrowPattern", ( daw, rowId, pattern ) => {
	const row = daw.get.drumrow( rowId );
	const pat = daw.get.pattern( pattern );

	if ( row.pattern !== pattern && pat.type === "buffer" ) {
		const oldPat = DAWCore.actionsCommon.getDrumrowName( daw, rowId );

		return [
			{ drumrows: { [ rowId ]: { pattern } } },
			[ "drumrows", "changeDrumrowPattern", oldPat, pat.name ],
		];
	}
} );
