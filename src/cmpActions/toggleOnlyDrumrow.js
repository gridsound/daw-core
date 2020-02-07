"use strict";

DAWCore.actions.toggleOnlyDrumrow = function( rowId, get ) {
	const patName = this._getPatByRowId( rowId ).name,
		entries = Object.entries( get.drumrows() ),
		someOn = entries.some( kv => kv[ 0 ] !== rowId && kv[ 1 ].toggle === true ),
		drumrows = entries.reduce( ( obj, [ id, row ] ) => {
			const itself = id === rowId;

			if ( ( itself && !row.toggle ) || ( !itself && row.toggle === someOn ) ) {
				obj[ id ] = { toggle: !row.toggle };
			}
			return obj;
		}, {} );

	return [
		{ drumrows },
		[ "drumrows", "toggleOnlyDrumrow", patName, !someOn ],
	];
};
