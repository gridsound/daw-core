"use strict";

DAWCoreActions.set( "addPatternBuffer", ( daw, srcType, srcPatId ) => {
	return DAWCoreActionsCommon.addPatternBuffer( daw, srcType, srcPatId )
		.then( ( [ newSrcPatId, newSrcPatName, newPatObj ] ) => {
			if ( newPatObj ) {
				return [
					newPatObj,
					[ "patterns", "addPatternBuffer", newSrcPatName ],
				];
			}
		} );
} );
