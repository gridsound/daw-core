"use strict";

DAWCore.actions.changeDrumrowPattern = function( rowId, pattern ) {
	const row = this.get.drumrow( rowId ),
		pat = this.get.pattern( pattern );

	if ( row.pattern !== pattern && pat.type === "buffer" ) {
		const oldPat = this._getPatByRowId( rowId ).name;

		return [
			{ drumrows: { [ rowId ]: { pattern } } },
			[ "drumrows", "changeDrumrowPattern", oldPat, pat.name ],
		];
	}
};
