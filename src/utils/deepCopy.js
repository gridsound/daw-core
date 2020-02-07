"use strict";

DAWCore.utils.deepCopy = obj => {
	if ( DAWCore.utils.isObject( obj ) ) {
		const cpy = {};

		Object.entries( obj ).forEach( kv => {
			cpy[ kv[ 0 ] ] = DAWCore.utils.deepCopy( kv[ 1 ] );
		} );
		return cpy;
	}
	return obj;
};
