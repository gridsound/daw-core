"use strict";

DAWCore.actions.toggleDrumrow = function( rowId, get ) {
	const patName = this._getPatByRowId( rowId ).name,
		toggle = !get.drumrow( rowId ).toggle;

	return [
		{ drumrows: { [ rowId ]: { toggle } } },
		[ "drumrows", "toggleDrumrow", patName, toggle ],
	];
};
