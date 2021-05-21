"use strict";

DAWCore.utils.composeUndo = ( data, redo ) => {
	if ( DAWCore.utils.isObject( data ) && DAWCore.utils.isObject( redo ) ) {
		return Object.freeze( Object.entries( redo ).reduce( ( undo, [ k, val ] ) => {
			if ( data[ k ] !== val ) {
				undo[ k ] = DAWCore.utils.composeUndo( data[ k ], val );
			}
			return undo;
		}, {} ) );
	}
	return data;
};
