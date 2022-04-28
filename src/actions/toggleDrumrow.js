"use strict";

DAWCore.actions.toggleDrumrow = ( rowId, get ) => {
	const patName = DAWCore.actionsCommon.getDrumrowName( rowId, get );
	const toggle = !get.drumrow( rowId ).toggle;

	return [
		{ drumrows: { [ rowId ]: { toggle } } },
		[ "drumrows", "toggleDrumrow", patName, toggle ],
	];
};
