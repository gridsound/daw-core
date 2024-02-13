"use strict";

DAWCoreActions.set( "addDrumrow", ( daw, patType, patId ) => {
	return DAWCoreActionsCommon.addPatternBuffer( daw, patType, patId )
		.then( ( [ patId, patName, patObj ] ) => {
			const drumrows = daw.$getDrumrows();
			const id = DAWCoreActionsCommon.getNextIdOf( drumrows );
			const order = DAWCoreActionsCommon.getNextOrderOf( drumrows );
			const rowObj = DAWCoreJSON.drumrow( { order, pattern: patId } );

			return [
				Object.assign( { drumrows: { [ id ]: rowObj } }, patObj ),
				[ "drumrows", "addDrumrow", patName ],
			];
		} );
} );
