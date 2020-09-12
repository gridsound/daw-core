"use strict";

DAWCore.actions.toggleSoloDrumrow = ( rowId, get ) => {
	const patName = DAWCore.common.getDrumrowName( rowId, get ),
		[ someOn, drumrows ] = DAWCore.common.toggleSolo( rowId, get.drumrows() );

	return [
		{ drumrows },
		[ "drumrows", "toggleSoloDrumrow", patName, someOn ],
	];
};
