"use strict";

DAWCore.actions.set( "reorderDrumrow", ( rowId, drumrows, get ) => {
	const patName = DAWCore.actionsCommon.getDrumrowName( rowId, get );

	return [
		{ drumrows },
		[ "drumrows", "reorderDrumrow", patName ],
	];
} );
