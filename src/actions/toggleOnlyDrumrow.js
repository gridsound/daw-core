"use strict";

DAWCore.actions.toggleOnlyDrumrow = ( rowId, get ) => {
	const patName = DAWCore.common.getDrumrowName( rowId, get ),
		[ someOn, drumrows ] = DAWCore.common.toggleSolo( rowId, get.drumrows() );

	return [
		{ drumrows },
		[ "drumrows", "toggleOnlyDrumrow", patName, someOn ],
	];
};
