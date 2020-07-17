"use strict";

DAWCore.actions.changeDrumsProps = ( patId, prop, arr, get ) => {
	const pat = get.pattern( patId ),
		rowId = get.drums( pat.drums )[ arr[ 0 ][ 0 ] ].row,
		patRowName = DAWCore.common.getDrumrowName( rowId, get ),
		obj = arr.reduce( ( obj, [ drmId, val ] ) => {
			obj[ drmId ] = { [ prop ]: val };
			return obj;
		}, {} );

	return [
		{ drums: { [ pat.drums ]: obj } },
		[ "drums", "changeDrumsProps", pat.name, patRowName, prop, arr.length ],
	];
};
