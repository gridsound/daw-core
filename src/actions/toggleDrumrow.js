"use strict";

function DAWCoreActions_toggleDrumrow( daw, rowId ) {
	const patName = DAWCoreActionsCommon_getDrumrowName( daw, rowId );
	const toggle = !daw.$getDrumrow( rowId ).toggle;

	return [
		{ drumrows: { [ rowId ]: { toggle } } },
		[ "drumrows", "toggleDrumrow", patName, toggle ],
	];
}
