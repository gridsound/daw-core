"use strict";

DAWCore.utils.composeUndo = ( data, obj ) => {
	if ( data && obj && typeof data === "object" && typeof obj === "object" ) {
		const undo = {};

		for ( const k in obj ) {
			if ( data[ k ] !== obj[ k ] ) {
				undo[ k ] = DAWCore.utils.composeUndo( data[ k ], obj[ k ] );
			}
		}
		return undo;
	}
	return data;
};
