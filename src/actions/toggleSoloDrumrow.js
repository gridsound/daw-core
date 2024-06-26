"use strict";

function DAWCoreActions_toggleSoloDrumrow( daw, rowId ) {
	const patName = DAWCoreActionsCommon_getDrumrowName( daw, rowId );
	const [ someOn, drumrows ] = DAWCoreActionsCommon_toggleSolo( rowId, daw.$getDrumrows() );

	return [
		{ drumrows },
		[ "drumrows", "toggleSoloDrumrow", patName, someOn ],
	];
}
