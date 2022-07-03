"use strict";

DAWCoreActionsCommon.getDrumrowName = ( daw, rowId ) => {
	return daw.$getPattern( daw.$getDrumrow( rowId ).pattern ).name;
};
