"use strict";

DAWCoreUtils.$deepAssign = ( a, b ) => {
	if ( b ) {
		Object.entries( b ).forEach( ( [ k, val ] ) => {
			if ( !DAWCoreUtils.$isObject( val ) ) {
				a[ k ] = val;
			} else if ( !DAWCoreUtils.$isObject( a[ k ] ) ) {
				a[ k ] = DAWCoreUtils.$deepCopy( val );
			} else {
				DAWCoreUtils.$deepAssign( a[ k ], val );
			}
		} );
	}
	return a;
};
