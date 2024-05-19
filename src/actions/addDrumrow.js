"use strict";

DAWCoreActions.addDrumrow = ( daw, patType, patId ) => {
	return DAWCoreActionsCommon_addPatternBuffer( daw, patType, patId )
		.then( ( [ patId, patName, patObj ] ) => {
			const drumrows = daw.$getDrumrows();
			const id = DAWCoreActionsCommon_getNextIdOf( drumrows );
			const order = DAWCoreActionsCommon_getNextOrderOf( drumrows );
			const rowObj = DAWCoreJSON.drumrow( { order, pattern: patId } );

			return [
				Object.assign( { drumrows: { [ id ]: rowObj } }, patObj ),
				[ "drumrows", "addDrumrow", patName ],
			];
		} );
};
