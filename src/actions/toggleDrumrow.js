"use strict";

DAWCore.actions.toggleDrumrow = ( rowId, get ) => {
	const patName = DAWCore.actions.common.getDrumrowName( rowId, get ),
		toggle = !get.drumrow( rowId ).toggle;

	return [
		{ drumrows: { [ rowId ]: { toggle } } },
		[ "drumrows", "toggleDrumrow", patName, toggle ],
	];
};
