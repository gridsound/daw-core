"use strict";

DAWCore.actions.set( "toggleSoloDrumrow", ( daw, rowId ) => {
	const patName = DAWCore.actionsCommon.getDrumrowName( daw, rowId );
	const [ someOn, drumrows ] = DAWCore.actionsCommon.toggleSolo( rowId, daw.$getDrumrows() );

	return [
		{ drumrows },
		[ "drumrows", "toggleSoloDrumrow", patName, someOn ],
	];
} );
