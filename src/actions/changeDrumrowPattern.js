"use strict";

DAWCoreActions.set( "changeDrumrowPattern", ( daw, rowId, patType, patId ) => {
	return DAWCoreActionsCommon.addPatternBuffer( daw, patType, patId )
		.then( ( [ patId, patName, patObj ] ) => {
			const row = daw.$getDrumrow( rowId );

			if ( row.pattern !== patId ) {
				const oldPat = DAWCoreActionsCommon.getDrumrowName( daw, rowId );

				return [
					Object.assign( { drumrows: { [ rowId ]: { pattern: patId } } }, patObj ),
					[ "drumrows", "changeDrumrowPattern", oldPat, patName ],
				];
			}
		} );
} );
