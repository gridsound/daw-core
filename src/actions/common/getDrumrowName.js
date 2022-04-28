"use strict";

DAWCore.actionsCommon.getDrumrowName = ( rowId, get ) => {
	return get.pattern( get.drumrow( rowId ).pattern ).name;
};
