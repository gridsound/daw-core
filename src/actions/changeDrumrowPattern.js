"use strict";

DAWCore.actions.changeDrumrowPattern = ( rowId, pattern, get ) => {
	const row = get.drumrow( rowId ),
		pat = get.pattern( pattern );

	if ( row.pattern !== pattern && pat.type === "buffer" ) {
		const oldPat = DAWCore.common.getDrumrowName( rowId, get );

		return [
			{ drumrows: { [ rowId ]: { pattern } } },
			[ "drumrows", "changeDrumrowPattern", oldPat, pat.name ],
		];
	}
};
