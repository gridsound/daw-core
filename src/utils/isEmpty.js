"use strict";

DAWCore.utils.isEmpty = obj => {
	for ( const a in obj ) {
		return false;
	}
	return true;
};
