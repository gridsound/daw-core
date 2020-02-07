"use strict";

DAWCore.actions.changeDrumrow = function( rowId, prop, val, get ) {
	const patName = this._getPatByRowId( rowId ).name;

	return [
		{ drumrows: { [ rowId ]: { [ prop ]: val } } },
		[ "drumrows", "changeDrumrow", patName, prop, val ],
	];
};
