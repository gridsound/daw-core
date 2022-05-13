"use strict";

DAWCore.actions.set( "changeDrumrow", ( daw, rowId, prop, val ) => {
	const patName = DAWCore.actionsCommon.getDrumrowName( daw, rowId );

	return [
		{ drumrows: { [ rowId ]: { [ prop ]: val } } },
		[ "drumrows", "changeDrumrow", patName, prop, val ],
	];
} );
