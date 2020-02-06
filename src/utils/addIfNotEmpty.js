"use strict";

DAWCore.utils.addIfNotEmpty = ( obj, attr, valObj ) => {
	if ( DAWCore.utils.isntEmpty( valObj ) ) {
		obj[ attr ] = valObj;
	}
	return obj;
};
