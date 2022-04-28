"use strict";

DAWCore.actions.set( "changeDrumsProps", ( patId, prop, arr, get ) => {
	const pat = get.pattern( patId );
	const rowId = get.drums( pat.drums )[ arr[ 0 ][ 0 ] ].row;
	const patRowName = DAWCore.actionsCommon.getDrumrowName( rowId, get );
	const obj = arr.reduce( ( obj, [ drmId, val ] ) => {
		obj[ drmId ] = { [ prop ]: val };
		return obj;
	}, {} );

	return [
		{ drums: { [ pat.drums ]: obj } },
		[ "drums", "changeDrumsProps", pat.name, patRowName, prop, arr.length ],
	];
} );
