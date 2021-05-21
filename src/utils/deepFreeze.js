"use strict";

DAWCore.utils.deepFreeze = obj => {
	if ( DAWCore.utils.isObject( obj ) ) {
		Object.freeze( obj );
		Object.values( obj ).forEach( DAWCore.utils.deepFreeze );
	}
	return obj;
};
