"use strict";

DAWCore.actions.set( "changeDrumrowPattern", ( rowId, pattern, get ) => {
	const row = get.drumrow( rowId );
	const pat = get.pattern( pattern );

	if ( row.pattern !== pattern && pat.type === "buffer" ) {
		const oldPat = DAWCore.actionsCommon.getDrumrowName( rowId, get );

		return [
			{ drumrows: { [ rowId ]: { pattern } } },
			[ "drumrows", "changeDrumrowPattern", oldPat, pat.name ],
		];
	}
} );
