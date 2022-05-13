"use strict";

DAWCore.actions.set( "changeDrumsProps", ( daw, patId, prop, arr ) => {
	const pat = daw.get.pattern( patId );
	const rowId = daw.get.drums( pat.drums )[ arr[ 0 ][ 0 ] ].row;
	const patRowName = DAWCore.actionsCommon.getDrumrowName( daw, rowId );
	const obj = arr.reduce( ( obj, [ drmId, val ] ) => {
		obj[ drmId ] = { [ prop ]: val };
		return obj;
	}, {} );

	return [
		{ drums: { [ pat.drums ]: obj } },
		[ "drums", "changeDrumsProps", pat.name, patRowName, prop, arr.length ],
	];
} );
