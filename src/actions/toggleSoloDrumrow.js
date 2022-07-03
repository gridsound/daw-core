"use strict";

DAWCoreActions.set( "toggleSoloDrumrow", ( daw, rowId ) => {
	const patName = DAWCoreActionsCommon.getDrumrowName( daw, rowId );
	const [ someOn, drumrows ] = DAWCoreActionsCommon.toggleSolo( rowId, daw.$getDrumrows() );

	return [
		{ drumrows },
		[ "drumrows", "toggleSoloDrumrow", patName, someOn ],
	];
} );
