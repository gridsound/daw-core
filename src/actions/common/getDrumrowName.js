"use strict";

DAWCore.actionsCommon.getDrumrowName = ( daw, rowId ) => {
	return daw.get.pattern( daw.get.drumrow( rowId ).pattern ).name;
};
