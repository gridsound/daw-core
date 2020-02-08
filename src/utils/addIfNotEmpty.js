"use strict";

DAWCore.utils.addIfNotEmpty = ( obj, attr, valObj ) => {
	if ( DAWCore.utils.isntEmpty( valObj ) ) {
		if ( attr in obj ) {
			DAWCore.utils.deepAssign( obj[ attr ], valObj );
		} else {
			obj[ attr ] = valObj;
		}
	}
	return obj;
};
