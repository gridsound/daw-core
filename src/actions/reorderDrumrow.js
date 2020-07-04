"use strict";

DAWCore.actions.reorderDrumrow = ( rowId, drumrows, get ) => {
	const patName = DAWCore.common.getDrumrowName( rowId, get );

	return [
		{ drumrows },
		[ "drumrows", "reorderDrumrow", patName ],
	];
};
