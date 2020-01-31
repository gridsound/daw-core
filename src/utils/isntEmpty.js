"use strict";

DAWCore.utils.isntEmpty = obj => {
	for ( const a in obj ) {
		return true;
	}
	return false;
};
