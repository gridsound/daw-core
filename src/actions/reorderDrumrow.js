"use strict";

DAWCore.actions.reorderDrumrow = ( rowId, drumrows, get ) => {
	const patName = DAWCore.actions.common.getDrumrowName( rowId, get );

	return [
		{ drumrows },
		[ "drumrows", "reorderDrumrow", patName ],
	];
};
