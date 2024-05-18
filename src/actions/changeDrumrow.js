"use strict";

DAWCoreActions.set( "changeDrumrow", ( daw, rowId, prop, val ) => {
	const patName = DAWCoreActionsCommon_getDrumrowName( daw, rowId );

	return [
		{ drumrows: { [ rowId ]: { [ prop ]: val } } },
		[ "drumrows", "changeDrumrow", patName, prop, val ],
	];
} );
