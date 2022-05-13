"use strict";

DAWCore.actionsCommon.getDrumrowName = ( daw, rowId ) => {
	return daw.$getPattern( daw.$getDrumrow( rowId ).pattern ).name;
};
