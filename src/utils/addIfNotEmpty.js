"use strict";

DAWCoreUtils.$addIfNotEmpty = ( obj, attr, valObj ) => {
	if ( DAWCoreUtils.$isntEmpty( valObj ) ) {
		if ( attr in obj ) {
			DAWCoreUtils.$deepAssign( obj[ attr ], valObj );
		} else {
			obj[ attr ] = valObj;
		}
	}
	return obj;
};
