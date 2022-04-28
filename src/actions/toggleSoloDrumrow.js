"use strict";

DAWCore.actions.set( "toggleSoloDrumrow", ( rowId, get ) => {
	const patName = DAWCore.actionsCommon.getDrumrowName( rowId, get );
	const [ someOn, drumrows ] = DAWCore.actionsCommon.toggleSolo( rowId, get.drumrows() );

	return [
		{ drumrows },
		[ "drumrows", "toggleSoloDrumrow", patName, someOn ],
	];
} );
