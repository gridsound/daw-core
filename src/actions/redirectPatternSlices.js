"use strict";

DAWCoreActions.set( "redirectPatternSlices", ( daw, patId, srcType, srcId ) => {
	return DAWCoreActionsCommon_addPatternBuffer( daw, srcType, srcId )
		.then( ( [ srcId, srcName, srcObj ] ) => {
			if ( srcId !== daw.$getPattern( patId ).source ) {
				return [
					GSUdeepAssign( { patterns: { [ patId ]: { source: srcId } } }, srcObj ),
					[ "patterns", "redirectPatternSlices", daw.$getPattern( patId ).name, srcName ],
				];
			}
		} );
} );
