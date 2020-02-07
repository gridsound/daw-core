"use strict";

DAWCore.utils.diffAssign = ( a, b ) => {
	if ( b ) {
		Object.entries( b ).forEach( ( [ k, val ] ) => {
			if ( a[ k ] !== val ) {
				if ( val === undefined ) {
					delete a[ k ];
				} else if ( !DAWCore.utils.isObject( val ) ) {
					a[ k ] = val;
				} else if ( !DAWCore.utils.isObject( a[ k ] ) ) {
					a[ k ] = DAWCore.utils.jsonCopy( val );
				} else {
					DAWCore.utils.diffAssign( a[ k ], val );
				}
			}
		} );
	}
	return a;
};
