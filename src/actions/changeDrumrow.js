"use strict";

DAWCoreActions.set( "changeDrumrow", ( daw, rowId, prop, val ) => {
	const patName = DAWCoreActionsCommon.getDrumrowName( daw, rowId );

	return [
		{ drumrows: { [ rowId ]: { [ prop ]: val } } },
		[ "drumrows", "changeDrumrow", patName, prop, val ],
	];
} );
