"use strict";

DAWCoreActions.set( "changeDrumsProps", ( daw, patId, prop, arr ) => {
	const pat = daw.$getPattern( patId );
	const rowId = daw.$getDrums( pat.drums )[ arr[ 0 ][ 0 ] ].row;
	const patRowName = DAWCoreActionsCommon.getDrumrowName( daw, rowId );
	const obj = arr.reduce( ( obj, [ drmId, val ] ) => {
		obj[ drmId ] = { [ prop ]: val };
		return obj;
	}, {} );

	return [
		{ drums: { [ pat.drums ]: obj } },
		[ "drums", "changeDrumsProps", pat.name, patRowName, prop, arr.length ],
	];
} );
