"use strict";

DAWCore.composeUndo = ( data, obj ) => {
	if ( data && obj && typeof data === "object" && typeof obj === "object" ) {
		const undo = {};

		for ( const k in obj ) {
			if ( data[ k ] !== obj[ k ] ) {
				undo[ k ] = DAWCore.composeUndo( data[ k ], obj[ k ] );
			}
		}
		return undo;
	}
	return data;
};
