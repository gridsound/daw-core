"use strict";

DAWCoreUtils.$composeUndo = ( data, redo ) => {
	if ( DAWCoreUtils.$isObject( data ) && DAWCoreUtils.$isObject( redo ) ) {
		return Object.freeze( Object.entries( redo ).reduce( ( undo, [ k, val ] ) => {
			if ( data[ k ] !== val ) {
				undo[ k ] = DAWCoreUtils.$composeUndo( data[ k ], val );
			}
			return undo;
		}, {} ) );
	}
	return data;
};
