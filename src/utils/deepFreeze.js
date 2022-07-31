"use strict";

DAWCoreUtils.$deepFreeze = obj => {
	if ( DAWCoreUtils.$isObject( obj ) ) {
		Object.freeze( obj );
		Object.values( obj ).forEach( DAWCoreUtils.$deepFreeze );
	}
	return obj;
};
