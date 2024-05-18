"use strict";

function DAWCoreActionsCommon_getDrumrowName( daw, rowId ) {
	return daw.$getPattern( daw.$getDrumrow( rowId ).pattern ).name;
}
