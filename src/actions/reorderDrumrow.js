"use strict";

DAWCore.actions.set( "reorderDrumrow", ( daw, rowId, drumrows ) => {
	const patName = DAWCore.actionsCommon.getDrumrowName( daw, rowId );

	return [
		{ drumrows },
		[ "drumrows", "reorderDrumrow", patName ],
	];
} );
