"use strict";

DAWCoreActions.set( "toggleDrumrow", ( daw, rowId ) => {
	const patName = DAWCoreActionsCommon.getDrumrowName( daw, rowId );
	const toggle = !daw.$getDrumrow( rowId ).toggle;

	return [
		{ drumrows: { [ rowId ]: { toggle } } },
		[ "drumrows", "toggleDrumrow", patName, toggle ],
	];
} );
