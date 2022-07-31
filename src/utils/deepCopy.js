"use strict";

DAWCoreUtils.$deepCopy = obj => {
	if ( DAWCoreUtils.$isObject( obj ) ) {
		return Object.entries( obj ).reduce( ( cpy, [ k, v ] ) => {
			cpy[ k ] = DAWCoreUtils.$deepCopy( v );
			return cpy;
		}, {} );
	}
	return obj;
};
