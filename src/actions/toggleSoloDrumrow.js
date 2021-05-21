"use strict";

DAWCore.actions.toggleSoloDrumrow = ( rowId, get ) => {
	const patName = DAWCore.actions.common.getDrumrowName( rowId, get ),
		[ someOn, drumrows ] = DAWCore.actions.common.toggleSolo( rowId, get.drumrows() );

	return [
		{ drumrows },
		[ "drumrows", "toggleSoloDrumrow", patName, someOn ],
	];
};
