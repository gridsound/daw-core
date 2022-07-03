"use strict";

DAWCoreActions.set( "reorderDrumrow", ( daw, rowId, drumrows ) => {
	const patName = DAWCoreActionsCommon.getDrumrowName( daw, rowId );

	return [
		{ drumrows },
		[ "drumrows", "reorderDrumrow", patName ],
	];
} );
