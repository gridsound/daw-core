"use strict";

function DAWCoreActions_reorderDrumrow( daw, rowId, drumrows ) {
	const patName = DAWCoreActionsCommon_getDrumrowName( daw, rowId );

	return [
		{ drumrows },
		[ "drumrows", "reorderDrumrow", patName ],
	];
}
