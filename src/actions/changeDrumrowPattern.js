"use strict";

DAWCoreActions.set( "changeDrumrowPattern", ( daw, rowId, patType, patId ) => {
	return DAWCoreActionsCommon_addPatternBuffer( daw, patType, patId )
		.then( ( [ patId, patName, patObj ] ) => {
			const row = daw.$getDrumrow( rowId );

			if ( row.pattern !== patId ) {
				const oldPat = DAWCoreActionsCommon_getDrumrowName( daw, rowId );

				return [
					Object.assign( { drumrows: { [ rowId ]: { pattern: patId } } }, patObj ),
					[ "drumrows", "changeDrumrowPattern", oldPat, patName ],
				];
			}
		} );
} );
