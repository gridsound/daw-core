"use strict";

DAWCoreActions.set( "changeDrumrowPattern", ( daw, rowId, pattern ) => {
	const row = daw.$getDrumrow( rowId );
	const pat = daw.$getPattern( pattern );

	if ( row.pattern !== pattern && pat.type === "buffer" ) {
		const oldPat = DAWCoreActionsCommon.getDrumrowName( daw, rowId );

		return [
			{ drumrows: { [ rowId ]: { pattern } } },
			[ "drumrows", "changeDrumrowPattern", oldPat, pat.name ],
		];
	}
} );
