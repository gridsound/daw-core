"use strict";

DAWCore.actions.toggleDrumrow = function( rowId ) {
	const patName = this._getPatByRowId( rowId ).name,
		toggle = !this.get.drumrow( rowId ).toggle;

	return [
		{ drumrows: { [ rowId ]: { toggle } } },
		[ "drumrows", "toggleDrumrow", patName, toggle ],
	];
};
