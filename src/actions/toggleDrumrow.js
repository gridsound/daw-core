"use strict";

DAWCore.actions.set( "toggleDrumrow", ( daw, rowId ) => {
	const patName = DAWCore.actionsCommon.getDrumrowName( daw, rowId );
	const toggle = !daw.get.drumrow( rowId ).toggle;

	return [
		{ drumrows: { [ rowId ]: { toggle } } },
		[ "drumrows", "toggleDrumrow", patName, toggle ],
	];
} );
