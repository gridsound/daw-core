"use strict";

DAWCore.actions.removeDrumrow = function( rowId ) {
	const patName = this._getPatByRowId( rowId ).name,
		drums = Object.entries( this.get.drums() ).reduce( ( obj, [ drumsId, drums ] ) => {
			const drumsObj = Object.entries( drums ).reduce( ( obj, [ drumId, drum ] ) => {
				if ( drum.row === rowId ) {
					obj[ drumId ] = undefined;
				}
				return obj;
			}, {} );

			DAWCore.utils.addIfNotEmpty( obj, drumsId, drumsObj );
			return obj;
		}, {} ),
		obj = { drumrows: { [ rowId ]: undefined } };

	DAWCore.utils.addIfNotEmpty( obj, "drums", drums );
	return [
		obj,
		[ "drumrows", "removeDrumrow", patName ],
	];
};
