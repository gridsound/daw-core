"use strict";

DAWCore.utils.deepCopy = obj => {
	if ( DAWCore.utils.isObject( obj ) ) {
		return Object.entries( obj ).reduce( ( cpy, [ k, v ] ) => {
			cpy[ k ] = DAWCore.utils.deepCopy( v );
			return cpy;
		}, {} );
	}
	return obj;
};
