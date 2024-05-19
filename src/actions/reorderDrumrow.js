"use strict";

DAWCoreActions.reorderDrumrow = ( daw, rowId, drumrows ) => {
	const patName = DAWCoreActionsCommon_getDrumrowName( daw, rowId );

	return [
		{ drumrows },
		[ "drumrows", "reorderDrumrow", patName ],
	];
};
