"use strict";

DAWCore.actions.reorderDrumrow = function( rowId, drumrows ) {
	const patName = this._getPatByRowId( rowId ).name;

	return [
		{ drumrows },
		[ "drumrows", "reorderDrumrow", patName ],
	];
};
