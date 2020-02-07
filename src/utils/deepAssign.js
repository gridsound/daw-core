"use strict";

DAWCore.utils.deepAssign = ( a, b ) => {
	if ( b ) {
		Object.entries( b ).forEach( ( [ k, val ] ) => {
			if ( !DAWCore.utils.isObject( val ) ) {
				a[ k ] = val;
			} else if ( !DAWCore.utils.isObject( a[ k ] ) ) {
				a[ k ] = DAWCore.utils.deepCopy( val );
			} else {
				DAWCore.utils.deepAssign( a[ k ], val );
			}
		} );
	}
	return a;
};
