"use strict";

DAWCore.actions.changeDrumrowPattern = function( rowId, pattern, get ) {
	const row = get.drumrow( rowId ),
		pat = get.pattern( pattern );

	if ( row.pattern !== pattern && pat.type === "buffer" ) {
		const oldPat = this._getPatByRowId( rowId ).name;

		return [
			{ drumrows: { [ rowId ]: { pattern } } },
			[ "drumrows", "changeDrumrowPattern", oldPat, pat.name ],
		];
	}
};
