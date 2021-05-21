"use strict";

DAWCore.actions.changeDrumrow = ( rowId, prop, val, get ) => {
	const patName = DAWCore.actions.common.getDrumrowName( rowId, get );

	return [
		{ drumrows: { [ rowId ]: { [ prop ]: val } } },
		[ "drumrows", "changeDrumrow", patName, prop, val ],
	];
};
