"use strict";

DAWCore.utils.addIfNotEmpty = ( data, attr, obj ) => {
	if ( DAWCore.utils.isntEmpty( obj ) ) {
		data[ attr ] = obj;
	}
};
