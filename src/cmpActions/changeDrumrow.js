"use strict";

DAWCore.actions.changeDrumrow = function( rowId, prop, val ) {
	const patName = this._getPatByRowId( rowId ).name;

	return [
		{ drumrows: { [ rowId ]: { [ prop ]: val } } },
		[ "drumrows", "changeDrumrow", patName, prop, val ],
	];
};
