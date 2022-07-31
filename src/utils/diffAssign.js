"use strict";

DAWCoreUtils.$diffAssign = ( a, b ) => {
	if ( b ) {
		Object.entries( b ).forEach( ( [ k, val ] ) => {
			if ( a[ k ] !== val ) {
				if ( val === undefined ) {
					delete a[ k ];
				} else if ( !DAWCoreUtils.$isObject( val ) ) {
					a[ k ] = val;
				} else if ( !DAWCoreUtils.$isObject( a[ k ] ) ) {
					a[ k ] = DAWCoreUtils.$jsonCopy( val );
				} else {
					DAWCoreUtils.$diffAssign( a[ k ], val );
				}
			}
		} );
	}
	return a;
};
